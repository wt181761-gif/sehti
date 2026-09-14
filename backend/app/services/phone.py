"""
Phone validation and normalization for Moroccan numbers.
All normalization happens here — nowhere else.
"""
import re
import hashlib


def normalize_ma_phone(raw: str) -> tuple[str, str]:
    """
    Returns (local, e164) e.g. ("0612345678", "+212612345678").
    Raises ValueError on invalid input.
    """
    cleaned = re.sub(r"[\s\-\(\)]", "", raw)
    if not re.match(r"^0[5-7][0-9]{8}$", cleaned):
        raise ValueError(f"Invalid Moroccan phone number: {raw!r}")
    local = cleaned
    e164 = "+212" + cleaned[1:]
    return local, e164


def phone_hash_for_pixels(e164: str) -> str:
    """
    Returns SHA-256 hex of digits-only version of E.164.
    e.g. "+212612345678" -> sha256("212612345678")
    """
    digits_only = e164.replace("+", "").strip()
    return hashlib.sha256(digits_only.encode("utf-8")).hexdigest()


def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode("utf-8")).hexdigest()
