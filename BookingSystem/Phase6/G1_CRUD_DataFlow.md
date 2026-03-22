# G1 - CRUD Data Flow (Booking System Phase6)

This document describes CRUD operations based on actual behavior observed and verified using browser Developer Tools (Network tab) in Booking System Phase6.

---

## CREATE (C)

```mermaid
sequenceDiagram
    actor U as User (Browser)
    participant F as form.js
    participant E as Express POST /api/resources
    participant DB as PostgreSQL

    U->>F: Fill form and click Create
    F->>E: POST /api/resources (JSON body)
    E->>DB: INSERT INTO resources

    alt Success
        DB-->>E: Inserted row
        E-->>F: 201 Created
        F-->>U: Show success message
    else Validation error
        E-->>F: 400 Bad Request
    else Duplicate resource
        E-->>F: 409 Conflict
    end
```

---

## READ (R)

```mermaid
sequenceDiagram
    actor U as User (Browser)
    participant R as resources.js
    participant E as Express GET /api/resources
    participant DB as PostgreSQL

    U->>R: Open /resources page
    R->>E: GET /api/resources
    E->>DB: SELECT * FROM resources

    alt Success
        DB-->>E: Rows returned
        E-->>R: 200 OK
        R-->>U: Display resources
    else Server error
        E-->>R: 500 Internal Server Error
    end
```

---

## UPDATE (U)

```mermaid
sequenceDiagram
    actor U as User (Browser)
    participant F as form.js
    participant E as Express PUT /api/resources/:id
    participant DB as PostgreSQL

    U->>F: Edit resource and click Update
    F->>E: PUT /api/resources/:id
    E->>DB: UPDATE resources

    alt Success
        DB-->>E: Updated row
        E-->>F: 200 OK
        F-->>U: Show success message
    else Not found
        E-->>F: 404 Not Found
    else Validation error
        E-->>F: 400 Bad Request
    end
```

---

## DELETE (D)

```mermaid
sequenceDiagram
    actor U as User (Browser)
    participant F as form.js
    participant E as Express DELETE /api/resources/:id
    participant DB as PostgreSQL

    U->>F: Click Delete
    F->>E: DELETE /api/resources/:id
    E->>DB: DELETE FROM resources

    alt Success
        DB-->>E: rowCount = 1
        E-->>F: 204 No Content
    else Not found
        DB-->>E: rowCount = 0
        E-->>F: 404 Not Found
    else Server error
        E-->>F: 500 Internal Server Error
    end
```

---

## Notes

- Verified using Chrome Developer Tools (Network tab)
- Observed endpoints:
  - GET → /api/resources → 200 OK
  - POST → /api/resources → 201 Created
  - PUT → /api/resources/:id → 200 OK
  - DELETE → /api/resources/:id → 204 No Content
