from datetime import datetime
from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship, sessionmaker, registry
from sqlalchemy.ext.declarative import declarative_base
from scissor_app import Base, engine
from pydantic import BaseModel


Session = sessionmaker(bind=engine)
session = Session()

mapper_registry = registry()
mapper_registry.configure()

Base = declarative_base()


class URL(Base):
    __tablename__ = "urls"
    id = Column(Integer, primary_key=True, index=True)
    original_url = Column(String(250), index=True)
    shortened_url = Column(String(10), index=True)
    qr_code_path = Column(String(250), index=True)
    visit_count = Column(Integer, default=0, index=True)
    time = Column(DateTime, default=datetime.utcnow)

    visits = relationship("Visit", back_populates="url")


class Visit(Base):
    __tablename__ = "visits"
    id = Column(Integer, primary_key=True, index=True)
    short_url = Column(String(10), index=True, nullable=False)
    time_shortened = Column(Integer, ForeignKey("urls.id"), nullable=False)
    visit_time = Column(DateTime, default=datetime.utcnow)

    url = relationship("URL", back_populates="visits")
