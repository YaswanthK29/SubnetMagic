import ipaddress
from typing import Any


def _mask_octets(mask: ipaddress.IPv4Address) -> list[int]:
    return list(mask.packed)


def _find_subnet_octet(mask_octets: list[int]) -> int:
    for i, octet in enumerate(mask_octets):
        if octet not in (0, 255):
            return i
    return 3


def _build_blocks(octet_value: int, magic: int, active_start: int) -> list[dict[str, Any]]:
    blocks = []
    start = 0
    while start < 256:
        end = min(start + magic - 1, 255)
        blocks.append({
            "start": start,
            "end": end,
            "label": f"{start}-{end}",
            "is_active": start == active_start,
        })
        start += magic
    return blocks


def calculate_subnet(ip: str, cidr: int) -> dict[str, Any]:
    network = ipaddress.ip_network(f"{ip}/{cidr}", strict=False)
    ip_obj = ipaddress.ip_address(ip)
    mask = network.netmask
    mask_octets = _mask_octets(mask)
    ip_octets = list(ip_obj.packed)

    subnet_octet = _find_subnet_octet(mask_octets)
    mask_octet_val = mask_octets[subnet_octet]
    magic_number = 256 - mask_octet_val if mask_octet_val not in (0, 255) else 256

    ip_octet_val = ip_octets[subnet_octet]
    block_start = (ip_octet_val // magic_number) * magic_number

    network_id = str(network.network_address)
    broadcast = str(network.broadcast_address)
    host_count = network.num_addresses
    usable_hosts = max(host_count - 2, 0) if cidr < 31 else host_count

    if cidr >= 31:
        first_host = network_id if cidr == 31 else str(ip_obj)
        last_host = broadcast if cidr == 31 else str(ip_obj)
        usable_range = f"{first_host} - {last_host}"
    else:
        first_host = str(network.network_address + 1)
        last_host = str(network.broadcast_address - 1)
        usable_range = f"{first_host} - {last_host}"

    mask_str = str(mask)

    steps = [
        f"Step 1: Convert /{cidr} to subnet mask → {mask_str}.",
        f"Step 2: Find the magic number in octet {subnet_octet + 1}: 256 − {mask_octet_val} = {magic_number}.",
        f"Step 3: Find the block boundary: floor({ip_octet_val} ÷ {magic_number}) × {magic_number} = {block_start}.",
        f"Step 4: Network ID is the block start address → {network_id}.",
        f"Step 5: Broadcast is the last address in the block → {broadcast}.",
        f"Step 6: Usable host range excludes network and broadcast → {usable_range} ({usable_hosts} hosts).",
    ]

    blocks = _build_blocks(ip_octet_val, magic_number, block_start)

    return {
        "ip": ip,
        "cidr": cidr,
        "subnet_mask": mask_str,
        "magic_number": magic_number,
        "network_id": network_id,
        "broadcast": broadcast,
        "host_count": host_count,
        "usable_hosts": usable_hosts,
        "usable_range": usable_range,
        "first_host": first_host,
        "last_host": last_host,
        "steps": steps,
        "blocks": blocks,
        "highlight_octet": subnet_octet,
    }
