import ipaddress
from typing import Any


def calculate_wildcard(mask: str) -> dict[str, Any]:
    subnet_mask = ipaddress.ip_address(mask.strip())
    mask_octets = list(subnet_mask.packed)
    wildcard_octets = [255 - o for o in mask_octets]
    wildcard = ".".join(str(o) for o in wildcard_octets)

    steps = [
        "Step 1: A wildcard mask is the inverse of the subnet mask — subtract each octet from 255.",
    ]

    for i, (m, w) in enumerate(zip(mask_octets, wildcard_octets), start=1):
        steps.append(f"Step {i + 1}: Octet {i}: 255 − {m} = {w}.")

    steps.append(f"Step {len(steps) + 1}: Combine the octets → Wildcard mask = {wildcard}.")

    return {
        "subnet_mask": str(subnet_mask),
        "wildcard": wildcard,
        "steps": steps,
    }
