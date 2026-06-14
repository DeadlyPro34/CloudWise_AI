from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.cloud_account import CloudAccount
from app.services.auth_service import get_user_organization
from app.services.report_service import generate_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/generate")
def generate(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Get the current user's organization
    org = get_user_organization(db, current_user.id)
    if not org:
        raise HTTPException(status_code=400, detail="No organization found.")
        
    # 2. Get the first connected cloud account for this org
    account = db.execute(
        select(CloudAccount).where(CloudAccount.organization_id == org.id)
    ).scalars().first()
    
    account_id = account.id if account else None
    
    # 3. Pass the valid account_id to the report generator instead of 'None'
    pdf_bytes = generate_report(db, account_id)
    
    return Response(
        content=pdf_bytes, 
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=report.pdf"}
    )
