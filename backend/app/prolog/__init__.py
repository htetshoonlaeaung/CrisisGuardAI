# backend/app/prolog/__init__.py
# Modular Prolog integration package for CrisisGuard AI.
# Exposes the Prolog engine bridge, query builder, parser, scheduler, and XAI utilities.

from .engine import PrologEngineBridge, get_prolog_engine
from .query_builder import PrologQueryBuilder
from .parser import PrologResultParser
from .scheduler import CLPFDScheduler
from .xai import XAIExplainer
from .exceptions import (
    PrologError,
    PrologQueryError,
    PrologEngineUnavailableError,
    PrologTimeoutError,
)

__all__ = [
    "PrologEngineBridge",
    "get_prolog_engine",
    "PrologQueryBuilder",
    "PrologResultParser",
    "CLPFDScheduler",
    "XAIExplainer",
    "PrologError",
    "PrologQueryError",
    "PrologEngineUnavailableError",
    "PrologTimeoutError",
]
