classDiagram
    class User {
        +id: UUID
        +name: String
        +email: String
        +passwordHash: String
        +isActive: Boolean
        +createdAt: DateTime
        +updatedAt: DateTime
        +lastLogin: DateTime
    }

    class Role {
        +name: Enum<ADMIN, BIBLIOTECARIO, USUARIO, ESTAGIARIO>
        +permissions: Permission[]
    }

    class Permission {
        +resource: String (ex: "livros", "usuarios")
        +actions: String[] (ex: ["create", "read", "update", "delete"])
    }

    User "1" --> "1" Role
    Role "1" --> "*" Permission