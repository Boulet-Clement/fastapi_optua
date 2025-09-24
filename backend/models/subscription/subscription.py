from datetime import datetime
from enum import Enum
from pydantic import BaseModel
from typing import Optional, List
from subscription_plan import SubscriptionPlan

class Subscription(BaseModel):
    plan: SubscriptionPlan = SubscriptionPlan.FREE_TRIAL
    start_date: datetime
    end_date: Optional[datetime] = None  # None = illimité, on peut pas today +3 month ?
    is_active: bool = True

#Et le user à subscriptions: List[Subscription] = []