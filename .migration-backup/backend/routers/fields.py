from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from ..models.schemas import FieldCreate, FieldOut, FieldUpdate
from .. import store

router = APIRouter(prefix="/api/fields", tags=["fields"])


@router.post("", response_model=FieldOut, status_code=status.HTTP_201_CREATED)
def register_field(payload: FieldCreate) -> FieldOut:
    return store.create_field(
        farmer_name=payload.farmer_name,
        farmer_phone=payload.farmer_phone,
        boundary=payload.boundary,
        planting_date=payload.planting_date,
        potato_variety=payload.potato_variety,
        location=payload.location,
    )


@router.get("", response_model=list[FieldOut])
def list_fields() -> list[FieldOut]:
    return store.list_fields()


@router.get("/{field_id}", response_model=FieldOut)
def get_field(field_id: str) -> FieldOut:
    f = store.get_field(field_id)
    if not f:
        raise HTTPException(status_code=404, detail="Field not found")
    return f


@router.put("/{field_id}", response_model=FieldOut)
def update_field(field_id: str, payload: FieldUpdate) -> FieldOut:
    updated = store.update_field(field_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Field not found")
    return updated


@router.delete("/{field_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_field(field_id: str) -> None:
    if not store.delete_field(field_id):
        raise HTTPException(status_code=404, detail="Field not found")
    return None
