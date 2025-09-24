from datetime import datetime
from enum import Enum
from pydantic import BaseModel
from typing import Optional, List

class SubscriptionPlan(str, Enum):
    FREE_TRIAL = "free_trial"
    BASIC = "basic"
    PREMIUM = "premium"
