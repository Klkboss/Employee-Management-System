from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DBSession = scoped_session(sessionmaker())  # ✅ Global session
Base = declarative_base()


from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from passlib.apps import custom_app_context as pwd_context
from sqlalchemy.schema import FetchedValue
Base = declarative_base()

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

class Employee(Base):
    __tablename__ = 'employees'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    position = Column(String(50))
    salary = Column(Float)
    department = Column(String(50))
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False,server_default=FetchedValue())  # 👈 Add this line

    user = relationship('User', back_populates='employees')  # 👈 Add this


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(128))

    employees = relationship('Employee', back_populates='user', cascade="all, delete-orphan")  # 👈 Add this

    def hash_password(self, password):
        self.password_hash = pwd_context.hash(password)
    
    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)
