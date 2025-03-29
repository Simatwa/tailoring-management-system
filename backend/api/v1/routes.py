from fastapi import (
    APIRouter,
    status,
    HTTPException,
    Depends,
    Query,
    Path,
    Form,
    UploadFile,
    File,
)
from fastapi.encoders import jsonable_encoder
from fastapi.security.oauth2 import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from users.models import CustomUser, UserMeasurements
from external.models import About, Message, FAQ, ServiceFeedback
from tailoring.models import Service, Order

# from django.contrib.auth.hashers import check_password
from api.v1.utils import token_id, generate_token, get_value
from api.v1.models import (
    TokenAuth,
    Profile,
    EditablePersonalData,
    Feedback,
    BusinessAbout,
    NewVisitorMessage,
    ServiceOffered,
    CompletedOrderDetail,
    ShallowCompletedOrderDetail,
    FAQDetails,
    UserFeedback,
    ShallowUserOrderDetails,
    UserOrderDetails,
    EditableUserMeasurements,
    CompleteUserMeasurements,
)

import asyncio
from typing import Annotated, Union, Optional
from pydantic import PositiveInt

router = APIRouter(prefix="/v1", tags=["v1"])


v1_auth_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/token",
    description="Generated API authentication token",
)


async def get_user(token: Annotated[str, Depends(v1_auth_scheme)]) -> CustomUser:
    """Ensures token passed match the one set"""
    if token:
        try:
            if token.startswith(token_id):

                def fetch_user(token) -> CustomUser:
                    return CustomUser.objects.get(token=token)

                return await asyncio.to_thread(fetch_user, token)

        except CustomUser.DoesNotExist:
            pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing token",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.post("/token", name="User token")
def fetch_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> TokenAuth:
    """
    - `username` : User username
    - `password` : User password.
    """
    try:
        user = CustomUser.objects.get(
            username=form_data.username
        )  # Temporarily restrict to students only
        if user.check_password(form_data.password):
            if user.token is None:
                user.token = generate_token()
                user.save()
            return TokenAuth(
                access_token=user.token,
                token_type="bearer",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password."
            )
    except CustomUser.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User does not exist.",
        )


@router.patch("/token", name="Generate new token")
def generate_new_token(user: Annotated[CustomUser, Depends(get_user)]) -> TokenAuth:
    user.token = generate_token()
    user.save()
    return TokenAuth(access_token=user.token)


@router.get("/profile", name="Profile information")
def profile_information(user: Annotated[CustomUser, Depends(get_user)]) -> Profile:
    return Profile(
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        email=user.email,
        location=user.location,
        username=user.username,
        date_of_birth=user.date_of_birth,
        gender=user.gender,
        profile=user.profile.name,
        is_staff=user.is_staff,
        date_joined=user.date_joined,
    )


@router.patch("/profile", name="Update profile")
def update_personal_info(
    user: Annotated[CustomUser, Depends(get_user)],
    updated_personal_data: EditablePersonalData,
) -> EditablePersonalData:
    user.first_name = updated_personal_data.first_name or user.first_name
    user.last_name = updated_personal_data.last_name or user.last_name
    user.phone_number = updated_personal_data.phone_number or user.phone_number
    user.email = updated_personal_data.email or user.email
    user.location = updated_personal_data.location or user.location
    user.save()
    return EditablePersonalData(
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        email=user.email,
        location=user.location,
    )


@router.get("/measurements", name="Get user measurements")
def get_user_measurements(
    user: Annotated[CustomUser, Depends(get_user)]
) -> CompleteUserMeasurements:
    try:
        measurements = UserMeasurements.objects.get(user=user)
        return CompleteUserMeasurements(**measurements.model_dump())
    except UserMeasurements.DoesNotExist:
        new_measurements = UserMeasurements.objects.create(
            user=user,
            chest=0,
            waist=0,
            hips=0,
            inseam=0,
            neck=0,
            sleeve_length=0,
            shoulder_width=0,
            thigh=0,
            calf=0,
        )
        new_measurements.save()
        new_measurements.refresh_from_db()
        return CompleteUserMeasurements(**new_measurements.model_dump())


@router.patch("/measurements", name="Update user measurements")
def update_user_measurements(
    user: Annotated[CustomUser, Depends(get_user)],
    updated_measurement: EditableUserMeasurements,
) -> CompleteUserMeasurements:
    measurement = UserMeasurements.objects.get(user=user)
    measurement.chest = get_value(updated_measurement.chest, measurement.chest)
    measurement.waist = get_value(updated_measurement.waist, measurement.waist)
    measurement.hips = get_value(updated_measurement.hips, measurement.hips)
    measurement.inseam = get_value(updated_measurement.inseam, measurement.inseam)
    measurement.neck = get_value(updated_measurement.neck, measurement.neck)
    measurement.sleeve_length = get_value(
        updated_measurement.sleeve_length, measurement.sleeve_length
    )
    measurement.shoulder_width = get_value(
        updated_measurement.shoulder_width, measurement.shoulder_width
    )
    measurement.thigh = get_value(updated_measurement.thigh, measurement.thigh)
    measurement.calf = get_value(updated_measurement.calf, measurement.calf)
    measurement.save()
    return CompleteUserMeasurements(**measurement.model_dump())


@router.post("/order", name="Place new order")
def place_new_order(
    user: Annotated[CustomUser, Depends(get_user)],
    service_name: Annotated[Service.ServiceName, Form(description="Service name")],
    details: Annotated[str, Form(description="Order description")],
    material_type: Annotated[Order.MaterialType, Form(description="Material type")],
    fabric_required: Annotated[bool, Form(description="Whether fabric is required")],
    quantity: Annotated[
        Optional[PositiveInt], Form(description="Units amount to be made")
    ] = 1,
    reference_image: Annotated[
        UploadFile, File(description="Photo of design reference/inspiration")
    ] = None,
    colors: Annotated[Optional[str], Form(description="Desired material color")] = None,
    urgency: Annotated[
        Optional[Order.OrderUrgency], Form(description="Order urgency")
    ] = Order.OrderUrgency.MEDIUM.value,
) -> UserOrderDetails:
    target_service = Service.objects.get(name=service_name.value)
    new_order = Order.objects.create(
        client=user,
        service=target_service,
        details=details,
        material_type=material_type.value,
        fabric_required=fabric_required,
        quantity=quantity,
        colors=colors,
        urgency=urgency.value,
    )
    if reference_image is not None:
        new_order.reference_image.save(
            name=reference_image.filename, content=reference_image.file, save=False
        )
    new_order.save()
    return UserOrderDetails(**new_order.model_dump())


@router.get("/orders", name="Get orders placed")
def get_orders_placed(
    user: Annotated[CustomUser, Depends(get_user)]
) -> list[ShallowUserOrderDetails]:
    order_details_list = []
    for order in Order.objects.filter(client=user).all().order_by("-created_at"):
        order.service_name = order.service.name
        order_details_list.append(ShallowUserOrderDetails(**jsonable_encoder(order)))
    return order_details_list


@router.get("/order/{id}", name="Get specific order details")
def get_specific_order_details(
    user: Annotated[CustomUser, Depends(get_user)],
    id: Annotated[int, Path(description="Order id")],
) -> UserOrderDetails:
    try:
        target_order = Order.objects.get(pk=id, client=user)
        target_order.service_name = target_order.service.name
        return UserOrderDetails(**jsonable_encoder(target_order))
    except Order.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with id {id} does not exist.",
        )


@router.patch("/order/{id}", name="Update a particular order")
def update_existing_order(
    user: Annotated[CustomUser, Depends(get_user)],
    id: Annotated[int, Path(description="Order id")],
    service_name: Annotated[
        Service.ServiceName, Form(description="Service name")
    ] = None,
    details: Annotated[str, Form(description="Order description")] = None,
    material_type: Annotated[
        Order.MaterialType, Form(description="Material type")
    ] = None,
    fabric_required: Annotated[
        bool, Form(description="Whether fabric is required")
    ] = None,
    quantity: Annotated[
        PositiveInt, Form(description="Units amount to be made")
    ] = None,
    reference_image: Annotated[
        UploadFile,
        File(description="Photo of design reference/inspiration"),
    ] = None,
    colors: Annotated[str, Form(description="Desired material color")] = None,
    urgency: Annotated[Order.OrderUrgency, Form(description="Order urgency")] = None,
) -> UserOrderDetails:
    try:
        target_order = Order.objects.get(pk=id, client=user)
        target_order.details = details or target_order.details
        target_order.material_type = (
            material_type.value
            if material_type is not None
            else target_order.material_type
        )
        target_order.fabric_required = (
            fabric_required
            if fabric_required is not None
            else target_order.fabric_required
        )
        target_order.quantity = quantity or target_order.quantity
        target_order.colors = colors or target_order.colors
        target_order.urgency = (
            urgency.value if urgency is not None else target_order.urgency
        )
        if service_name:
            target_order.service = Service.objects.get(name=service_name.value)
        if reference_image is not None:
            if target_order.reference_image is not None:
                target_order.reference_image.delete(save=False)
            target_order.reference_image.save(
                name=reference_image.filename, content=reference_image.file, save=False
            )
        target_order.save()
        target_order.refresh_from_db()
        return UserOrderDetails(**target_order.model_dump())

    except Order.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with id {id} does not exist.",
        )


@router.delete("/order/{id}", name="Delete a placed order")
def delete_placed_order(
    user: Annotated[CustomUser, Depends(get_user)],
    id: Annotated[int, Path(description="Order ID")],
) -> Feedback:
    try:
        target_order = Order.objects.get(
            pk=id, client=user, status=Order.OrderStatus.PENDING.value
        )
        target_order.delete()
        return Feedback(detail="Order deleted succesfully.")
    except Order.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with id {id} does not exist or is not pending.",
        )


@router.get("/user/exists", name="Check if username exists")
def check_if_username_exists(
    username: Annotated[str, Query(description="Username to check against")]
) -> Feedback:
    """Checks if account with a particular username exists
    - Useful when setting username at account creation
    """
    try:
        CustomUser.objects.get(username=username)
        return Feedback(detail=True)
    except CustomUser.DoesNotExist:
        return Feedback(detail=False)


@router.get("/about", name="Business information")
def get_hospital_details() -> BusinessAbout:
    return BusinessAbout(**jsonable_encoder(About.objects.all().first()))


@router.post("/message", name="New visitor message")
def new_visitor_message(message: NewVisitorMessage) -> Feedback:
    new_message = Message.objects.create(**message.model_dump())
    new_message.save()
    return Feedback(detail="Message received succesfully.")


@router.get("/services-offered", name="Get services offered")
def get_services_offered() -> list[ServiceOffered]:
    return [
        ServiceOffered(**jsonable_encoder(service))
        for service in Service.objects.all().order_by("created_at").all()[:15]
    ]


@router.get("/latest-work", name="Get latest work")
def get_latest_work() -> list[ShallowCompletedOrderDetail]:
    completed_orders = (
        Order.objects.filter(
            status=Order.OrderStatus.COMPLETED.value, show_in_index=True
        )
        .order_by("-created_at")
        .all()[:15]
    )
    return [
        ShallowCompletedOrderDetail(id=order.id, picture=order.picture.name)
        for order in completed_orders
    ]


@router.get("/latest-work/{id}", name="Get specific latest work details")
def get_specific_latest_work(
    id: Annotated[int, Path(description="Order ID")]
) -> CompletedOrderDetail:
    try:
        target_order = Order.objects.get(
            pk=id, show_in_index=True, status=Order.OrderStatus.COMPLETED.value
        )
        order_details = jsonable_encoder(target_order)
        order_details["service_name"] = target_order.service.name
        return CompletedOrderDetail(**order_details)
    except Order.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with id {id} does not exist.",
        )


@router.get("/feedbacks", name="Get client feedbacks")
def get_client_feedbacks() -> list[UserFeedback]:
    feedbacks = (
        ServiceFeedback.objects.filter(show_in_index=True)
        .order_by("-created_at")
        .all()[:6]
    )
    feedback_list = []
    for feedback in feedbacks:
        feedback_dict = jsonable_encoder(feedback)
        feedback_dict["user"] = UserFeedback.UserInfo(
            first_name=feedback.sender.first_name,
            last_name=feedback.sender.last_name,
            role=feedback.sender_role,
            profile=feedback.sender.profile.name,
        )
        feedback_list.append(UserFeedback(**feedback_dict))
    return feedback_list


@router.get("/faqs", name="Get frequently asked questions")
def get_faqs() -> list[FAQDetails]:
    return [
        FAQDetails(**jsonable_encoder(faq))
        for faq in FAQ.objects.filter(is_shown=True).order_by("created_at").all()[:10]
    ]
