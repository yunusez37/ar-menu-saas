from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Supabase PostgreSQL Bulut Bağlantı Adresi
SQLALCHEMY_DATABASE_URL = "postgresql://postgres.tnwannhtgdwrbwqgjpmm:Fuyuke101225@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()