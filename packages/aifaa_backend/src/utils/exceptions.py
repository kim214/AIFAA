class ServiceError(Exception):
    pass

class NotFoundError(ServiceError):
    def __init__(self, message: str = "Resource not found"):
        self.message = message
        super().__init__(self.message)

class ValidationError(ServiceError):
    def __init__(self, message: str = "Invalid data"):
        self.message = message
        super().__init__(self.message)

class ConflictError(ServiceError):
    def __init__(self, message: str = "Conflict: Resource already exists"):
        self.message = message
        super().__init__(self.message)
