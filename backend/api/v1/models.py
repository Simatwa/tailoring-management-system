from pydantic import BaseModel, Field, field_validator, Field, EmailStr, PastDatetime
from typing import Optional, Any
from datetime import datetime, date
from tailoring_ms.settings import MEDIA_URL
from users.models import CustomUser
from external.models import ServiceFeedback
from tailoring.models import Service, Order
from os import path


class TokenAuth(BaseModel):
    """
    - `access_token` : Token value.
    - `token_type` : bearer
    """

    access_token: str
    token_type: Optional[str] = "bearer"

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "tms_27b9d79erc245r44b9rba2crd2273b5cbb71",
                "token_type": "bearer",
            }
        }


class Feedback(BaseModel):
    detail: Any = Field(description="Feedback in details")

    class Config:
        json_schema_extra = {
            "example": {"detail": "This is a detailed feedback message."}
        }


class NewFeedbackInfo(BaseModel):
    message: str
    rate: ServiceFeedback.FeedbackRate

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Great service!",
                "rate": "Excellent",
            }
        }


class UpdateFeedbackInfo(BaseModel):
    message: Optional[str] = None
    rate: Optional[ServiceFeedback.FeedbackRate] = None

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Good service.",
                "rate": "Good",
            }
        }


class CompleteFeedbackInfo(NewFeedbackInfo):
    id: int
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_model(cls, obj: ServiceFeedback):
        assert isinstance(
            obj, ServiceFeedback
        ), f"Obj must be an instance of {ServiceFeedback} not {type(obj)}"
        cls.id = obj.id
        cls.message = obj.message
        cls.rate = obj.rate
        cls.created_at = obj.created_at
        cls.updated_at = obj.updated_at
        return cls

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "message": "Great service!",
                "rate": "Excellent",
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-02T00:00:00",
            }
        }


class UserFeedback(CompleteFeedbackInfo):
    class UserInfo(BaseModel):
        first_name: Optional[str] = None
        last_name: Optional[str] = None
        role: ServiceFeedback.SenderRole
        profile: Optional[str]

        @field_validator("profile")
        def validate_cover_photo(value):
            if value and not value.startswith("/"):
                return path.join(MEDIA_URL, value)
            return value

        class Config:
            json_schema_extra = {
                "example": {
                    "first_name": "John",
                    "last_name": "Doe",
                    "role": "Regular Client",
                    "profile": "/media/custom_user/profile.jpg",
                }
            }

    user: UserInfo

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "message": "Great service!",
                "rate": "Excellent",
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-02T00:00:00",
                "user": {
                    "username": "johndoe",
                    "first_name": "John",
                    "last_name": "Doe",
                    "role": "Patient",
                    "profile": "/media/custom_user/profile.jpg",
                },
            }
        }


class EditablePersonalData(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "first_name": "John",
                "last_name": "Doe",
                "phone_number": "+1234567890",
                "email": "john.doe@example.com",
                "location": "123 Main St, Anytown, USA",
            }
        }


class Profile(EditablePersonalData):
    username: str
    date_of_birth: date
    gender: CustomUser.UserGender
    profile: Optional[str] = None
    is_staff: Optional[bool] = False
    date_joined: datetime

    @field_validator("profile")
    def validate_file(value):
        if value:
            return path.join(MEDIA_URL, value)
        return value

    class Config:
        json_schema_extra = {
            "example": {
                "first_name": "John",
                "last_name": "Doe",
                "phone_number": "+1234567890",
                "email": "john.doe@example.com",
                "location": "123 Main St, Anytown, USA",
                "username": "johndoe",
                "date_of_birth": "1990-01-01",
                "gender": "male",
                "profile": "/media/custom_user/profile.jpg",
                "is_staff": False,
                "date_joined": "2023-01-01T00:00:00",
            }
        }


class BusinessAbout(BaseModel):
    name: str
    short_name: str
    details: str
    slogan: str
    address: str
    founded_in: date
    email: Optional[str] = None
    phone_number: Optional[str] = None
    facebook: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    instagram: Optional[str] = None
    tiktok: Optional[str] = None
    youtube: Optional[str] = None
    logo: Optional[str] = None
    wallpaper: Optional[str] = None

    @field_validator("logo", "wallpaper")
    def validate_file(value):
        if value and not value.startswith("/"):
            return path.join(MEDIA_URL, value)
        return value

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Tailoring MS",
                "short_name": "TMS",
                "details": "Welcome to Tailoring MS. We are committed to providing the best tailoring services.",
                "slogan": "Experience the art of custom tailoring with precision and style.",
                "address": "123 Fashion Street, Meru - Kenya",
                "founded_in": "2023-01-01",
                "email": "admin@hospital.com",
                "phone_number": "+25411111111",
                "facebook": "https://www.facebook.com/",
                "twitter": "https://www.x.com/",
                "linkedin": "https://www.linkedin.com/",
                "instagram": "https://www.instagram.com/",
                "tiktok": "https://www.tiktok.com/",
                "youtube": "https://www.youtube.com/",
                "logo": "/media/default/logo.png",
                "wallpaper": "/media/default/wallpaper.jpg",
            }
        }


class NewVisitorMessage(BaseModel):
    sender: str
    email: EmailStr
    body: str


class ServiceOffered(BaseModel):
    name: str
    description: str
    picture: str
    starting_price: float
    ending_price: float

    @field_validator("picture")
    def validate_file(value: str):
        if value and not value.startswith("/"):
            return path.join(MEDIA_URL, value)
        return value


class ShallowCompletedOrderDetail(BaseModel):
    id: int
    picture: str

    @field_validator("picture")
    def validate_picture(value: str):
        if value and not value.startswith("/"):
            return path.join(MEDIA_URL, value)
        return value


class CompletedOrderDetail(ShallowCompletedOrderDetail):
    service_name: Service.ServiceName
    details: str
    material_type: Order.MaterialType
    fabric_required: bool
    reference_image: str
    charges: float
    created_at: PastDatetime

    @field_validator("reference_image")
    def validate_reference_image(value: str):
        if value and not value.startswith("/"):
            return path.join(MEDIA_URL, value)
        return value


class FAQDetails(BaseModel):
    question: str
    answer: str
