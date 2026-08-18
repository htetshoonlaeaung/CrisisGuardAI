# backend/app/prolog/exceptions.py
# Custom exception hierarchy for Prolog engine operations and PySwip bridge.

class PrologError(Exception):
    """Base exception for all Prolog-related failures."""
    pass

class PrologEngineUnavailableError(PrologError):
    """Raised when the SWI-Prolog engine or libswipl shared library cannot be loaded."""
    pass

class PrologQueryError(PrologError):
    """Raised when a query fails, encounters syntax errors, or returns unexpected results."""
    pass

class PrologTimeoutError(PrologError):
    """Raised when a reasoning query or CLP(FD) constraint solving exceeds deadline."""
    pass
