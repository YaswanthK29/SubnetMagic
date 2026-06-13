import ipaddress
import math
from typing import Any


def _hosts_to_cidr(hosts_needed: int) -> int:
    """Return prefix length for at least hosts_needed usable addresses."""
    total = hosts_needed + 2  # network + broadcast
    host_bits = math.ceil(math.log2(total))
    return 32 - host_bits


def calculate_vlsm(network: str, hosts: list[int]) -> dict[str, Any]:
    base = ipaddress.ip_network(network.strip(), strict=False)
    sorted_hosts = sorted(hosts, reverse=True)

    allocations: list[dict[str, Any]] = []
    steps = [
        f"Step 1: Sort host requirements descending: {sorted_hosts}.",
        f"Step 2: Starting from base network {base}.",
    ]

    current = int(base.network_address)
    step_num = 3

    for hosts_required in sorted_hosts:
        prefix = _hosts_to_cidr(hosts_required)
        subnet_size = 2 ** (32 - prefix)

        # Align current address to subnet boundary
        if current % subnet_size != 0:
            current = ((current // subnet_size) + 1) * subnet_size

        if current + subnet_size - 1 > int(base.broadcast_address):
            raise ValueError(
                f"Not enough address space for {hosts_required} hosts. "
                "Reduce requirements or use a larger base network."
            )

        subnet = ipaddress.ip_network(f"{ipaddress.IPv4Address(current)}/{prefix}")
        usable = max(subnet.num_addresses - 2, 0)

        first_host = str(subnet.network_address + 1) if prefix < 31 else str(subnet.network_address)
        last_host = str(subnet.broadcast_address - 1) if prefix < 31 else str(subnet.broadcast_address)

        allocations.append({
            "network": f"{subnet.network_address}/{prefix}",
            "cidr": prefix,
            "subnet_mask": str(subnet.netmask),
            "hosts_required": hosts_required,
            "usable_hosts": usable,
            "network_id": str(subnet.network_address),
            "broadcast": str(subnet.broadcast_address),
            "usable_range": f"{first_host} - {last_host}",
        })

        steps.append(
            f"Step {step_num}: Allocate /{prefix} for {hosts_required} hosts → "
            f"{subnet.network_address}/{prefix} (usable: {usable})."
        )
        step_num += 1
        current = int(subnet.broadcast_address) + 1

    steps.append(
        f"Step {step_num}: VLSM complete — {len(allocations)} subnets allocated efficiently."
    )

    return {
        "base_network": str(base),
        "allocations": allocations,
        "steps": steps,
    }
