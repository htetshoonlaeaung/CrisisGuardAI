# backend/app/services/prolog_engine.py
# Re-exports the unified PrologEngineBridge singleton from app.prolog

from app.prolog.engine import PrologEngineBridge, prolog_bridge, get_prolog_engine

__all__ = ["PrologEngineBridge", "prolog_bridge", "get_prolog_engine"]
