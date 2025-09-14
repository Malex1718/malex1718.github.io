# Patrones de Diseño Implementados

## 📚 Introducción

Este documento detalla los patrones de diseño implementados en los proyectos del portafolio, demostrando conocimiento práctico de soluciones probadas a problemas comunes de software.

## 🏗️ Patrones Creacionales

### 1. **Factory Pattern**

#### Implementación en Go API
```go
// internal/services/factory.go
type ServiceFactory struct {
    db     *sql.DB
    config *Config
}

func NewServiceFactory(db *sql.DB, config *Config) *ServiceFactory {
    return &ServiceFactory{db: db, config: config}
}

func (f *ServiceFactory) CreateUserService() UserService {
    repo := repository.NewUserRepository(f.db)
    return services.NewUserService(repo, f.config.JWTSecret)
}

func (f *ServiceFactory) CreateTaskService() TaskService {
    repo := repository.NewTaskRepository(f.db)
    return services.NewTaskService(repo)
}
```

#### Implementación en React
```typescript
// services/api/factory.ts
class APIClientFactory {
  static create(type: 'rest' | 'graphql', config: APIConfig) {
    switch(type) {
      case 'rest':
        return new RESTClient(config)
      case 'graphql':
        return new GraphQLClient(config)
      default:
        throw new Error(`Unknown API type: ${type}`)
    }
  }
}

// Uso
const client = APIClientFactory.create('rest', { baseURL: '/api' })
```

### 2. **Singleton Pattern**

#### Servicios de IA
```typescript
// services/claude.ts
class ClaudeService {
  private static instance: ClaudeService
  private client: Anthropic | null = null
  
  private constructor() {}
  
  static getInstance(): ClaudeService {
    if (!ClaudeService.instance) {
      ClaudeService.instance = new ClaudeService()
    }
    return ClaudeService.instance
  }
  
  initialize(apiKey: string) {
    if (!this.client) {
      this.client = new Anthropic({ apiKey })
    }
  }
}

export const claudeService = ClaudeService.getInstance()
```

### 3. **Builder Pattern**

#### Query Builder
```go
// pkg/querybuilder/builder.go
type QueryBuilder struct {
    table      string
    selectCols []string
    whereConds []string
    orderBy    string
    limit      int
    offset     int
}

func NewQueryBuilder(table string) *QueryBuilder {
    return &QueryBuilder{table: table}
}

func (q *QueryBuilder) Select(cols ...string) *QueryBuilder {
    q.selectCols = cols
    return q
}

func (q *QueryBuilder) Where(condition string) *QueryBuilder {
    q.whereConds = append(q.whereConds, condition)
    return q
}

func (q *QueryBuilder) OrderBy(col string) *QueryBuilder {
    q.orderBy = col
    return q
}

func (q *QueryBuilder) Limit(n int) *QueryBuilder {
    q.limit = n
    return q
}

func (q *QueryBuilder) Build() string {
    // Construir query SQL
}

// Uso
query := NewQueryBuilder("users").
    Select("id", "name", "email").
    Where("status = 'active'").
    OrderBy("created_at DESC").
    Limit(10).
    Build()
```

## 🎭 Patrones Estructurales

### 1. **Adapter Pattern**

#### Adaptador para diferentes providers de IA
```typescript
// services/ai/adapter.ts
interface AIProvider {
  chat(message: string): Promise<string>
  complete(prompt: string): Promise<string>
}

class ClaudeAdapter implements AIProvider {
  private claude: ClaudeService
  
  constructor(apiKey: string) {
    this.claude = new ClaudeService(apiKey)
  }
  
  async chat(message: string): Promise<string> {
    return this.claude.sendMessage([{ role: 'user', content: message }])
  }
  
  async complete(prompt: string): Promise<string> {
    return this.claude.complete(prompt)
  }
}

class OpenAIAdapter implements AIProvider {
  private openai: OpenAI
  
  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey })
  }
  
  async chat(message: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }]
    })
    return response.choices[0].message.content
  }
  
  async complete(prompt: string): Promise<string> {
    // Implementación OpenAI
  }
}
```

### 2. **Decorator Pattern**

#### Middleware en Go
```go
// internal/middleware/decorator.go
type HandlerFunc func(*fiber.Ctx) error

func WithLogging(handler HandlerFunc) HandlerFunc {
    return func(c *fiber.Ctx) error {
        start := time.Now()
        
        err := handler(c)
        
        log.Printf(
            "%s %s - %d - %v",
            c.Method(),
            c.Path(),
            c.Response().StatusCode(),
            time.Since(start),
        )
        
        return err
    }
}

func WithAuth(handler HandlerFunc) HandlerFunc {
    return func(c *fiber.Ctx) error {
        token := c.Get("Authorization")
        if !isValidToken(token) {
            return c.Status(401).JSON(fiber.Map{
                "error": "Unauthorized",
            })
        }
        return handler(c)
    }
}

// Uso
app.Get("/protected", WithAuth(WithLogging(protectedHandler)))
```

#### HOC en React
```typescript
// components/hoc/withAuth.tsx
function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    
    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login')
      }
    }, [isAuthenticated, navigate])
    
    if (!isAuthenticated) {
      return <div>Redirecting...</div>
    }
    
    return <Component {...props} />
  }
}

// Uso
const ProtectedDashboard = withAuth(Dashboard)
```

### 3. **Composite Pattern**

#### Componentes React compuestos
```typescript
// components/Form/index.tsx
interface FormComponent {
  Field: typeof FormField
  Group: typeof FormGroup
  Submit: typeof FormSubmit
}

const Form: React.FC<FormProps> & FormComponent = ({ children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      {children}
    </form>
  )
}

const FormField: React.FC<FieldProps> = ({ label, name, type }) => {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input name={name} type={type} />
    </div>
  )
}

const FormGroup: React.FC<GroupProps> = ({ children, title }) => {
  return (
    <fieldset>
      <legend>{title}</legend>
      {children}
    </fieldset>
  )
}

Form.Field = FormField
Form.Group = FormGroup
Form.Submit = FormSubmit

// Uso
<Form onSubmit={handleSubmit}>
  <Form.Group title="Personal Info">
    <Form.Field label="Name" name="name" type="text" />
    <Form.Field label="Email" name="email" type="email" />
  </Form.Group>
  <Form.Submit>Save</Form.Submit>
</Form>
```

## 🔄 Patrones de Comportamiento

### 1. **Observer Pattern**

#### Event Emitter en Node.js
```typescript
// services/eventBus.ts
import { EventEmitter } from 'events'

class EventBus extends EventEmitter {
  private static instance: EventBus
  
  private constructor() {
    super()
  }
  
  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }
}

export const eventBus = EventBus.getInstance()

// Publicar eventos
eventBus.emit('user:login', { userId: '123', timestamp: new Date() })

// Suscribirse a eventos
eventBus.on('user:login', (data) => {
  console.log('User logged in:', data)
  analytics.track('login', data)
})
```

#### Zustand Store (React)
```typescript
// store/useStore.ts
interface StoreState {
  // State
  messages: Message[]
  isLoading: boolean
  
  // Actions
  addMessage: (message: Message) => void
  setLoading: (loading: boolean) => void
  
  // Subscriptions
  subscribe: (listener: () => void) => () => void
}

const useStore = create<StoreState>((set, get) => ({
  messages: [],
  isLoading: false,
  
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }))
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading })
  },
  
  subscribe: (listener) => {
    // Zustand maneja las suscripciones internamente
    return useStore.subscribe(listener)
  }
}))
```

### 2. **Strategy Pattern**

#### Estrategias de autenticación
```go
// internal/auth/strategy.go
type AuthStrategy interface {
    Authenticate(credentials map[string]string) (*User, error)
    ValidateToken(token string) (*Claims, error)
}

type JWTStrategy struct {
    secret string
}

func (j *JWTStrategy) Authenticate(credentials map[string]string) (*User, error) {
    // Validar usuario/contraseña
    // Generar JWT
}

func (j *JWTStrategy) ValidateToken(token string) (*Claims, error) {
    // Validar JWT
}

type OAuth2Strategy struct {
    provider string
}

func (o *OAuth2Strategy) Authenticate(credentials map[string]string) (*User, error) {
    // OAuth2 flow
}

// Context
type AuthContext struct {
    strategy AuthStrategy
}

func (c *AuthContext) SetStrategy(strategy AuthStrategy) {
    c.strategy = strategy
}

func (c *AuthContext) Login(credentials map[string]string) (*User, error) {
    return c.strategy.Authenticate(credentials)
}
```

### 3. **Command Pattern**

#### Sistema de comandos para chat
```typescript
// commands/chatCommands.ts
interface Command {
  execute(): Promise<void>
  undo(): Promise<void>
}

class SendMessageCommand implements Command {
  constructor(
    private message: Message,
    private service: ChatService,
    private store: ChatStore
  ) {}
  
  async execute(): Promise<void> {
    this.store.addMessage(this.message)
    await this.service.sendMessage(this.message)
  }
  
  async undo(): Promise<void> {
    this.store.removeMessage(this.message.id)
    await this.service.deleteMessage(this.message.id)
  }
}

class CommandInvoker {
  private history: Command[] = []
  private currentIndex = -1
  
  async execute(command: Command): Promise<void> {
    await command.execute()
    
    // Eliminar comandos posteriores si estamos en medio del historial
    this.history = this.history.slice(0, this.currentIndex + 1)
    
    this.history.push(command)
    this.currentIndex++
  }
  
  async undo(): Promise<void> {
    if (this.currentIndex >= 0) {
      const command = this.history[this.currentIndex]
      await command.undo()
      this.currentIndex--
    }
  }
  
  async redo(): Promise<void> {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++
      const command = this.history[this.currentIndex]
      await command.execute()
    }
  }
}
```

### 4. **Chain of Responsibility**

#### Pipeline de validación
```go
// internal/validation/chain.go
type ValidationHandler interface {
    SetNext(handler ValidationHandler)
    Handle(data interface{}) error
}

type BaseHandler struct {
    next ValidationHandler
}

func (h *BaseHandler) SetNext(handler ValidationHandler) {
    h.next = handler
}

type RequiredFieldsHandler struct {
    BaseHandler
    fields []string
}

func (h *RequiredFieldsHandler) Handle(data interface{}) error {
    // Validar campos requeridos
    for _, field := range h.fields {
        if !hasField(data, field) {
            return fmt.Errorf("campo requerido: %s", field)
        }
    }
    
    if h.next != nil {
        return h.next.Handle(data)
    }
    return nil
}

type EmailValidationHandler struct {
    BaseHandler
}

func (h *EmailValidationHandler) Handle(data interface{}) error {
    // Validar formato de email
    email := getField(data, "email")
    if !isValidEmail(email) {
        return errors.New("email inválido")
    }
    
    if h.next != nil {
        return h.next.Handle(data)
    }
    return nil
}

// Uso
requiredHandler := &RequiredFieldsHandler{fields: []string{"name", "email"}}
emailHandler := &EmailValidationHandler{}
passwordHandler := &PasswordValidationHandler{minLength: 8}

requiredHandler.SetNext(emailHandler)
emailHandler.SetNext(passwordHandler)

err := requiredHandler.Handle(userData)
```

## 🏛️ Patrones Arquitectónicos

### 1. **MVC (Model-View-Controller)**

```go
// Model
type Task struct {
    ID          string    `json:"id"`
    Title       string    `json:"title"`
    Description string    `json:"description"`
    Status      string    `json:"status"`
}

// Repository (Model layer)
type TaskRepository interface {
    Create(task *Task) error
    GetByID(id string) (*Task, error)
    Update(task *Task) error
    Delete(id string) error
}

// Service (Controller layer)
type TaskService struct {
    repo TaskRepository
}

func (s *TaskService) CreateTask(req CreateTaskRequest) (*Task, error) {
    // Business logic
    task := &Task{
        ID:          uuid.New().String(),
        Title:       req.Title,
        Description: req.Description,
        Status:      "pending",
    }
    
    if err := s.repo.Create(task); err != nil {
        return nil, err
    }
    
    return task, nil
}

// Handler (View layer)
func (h *TaskHandler) CreateTask(c *fiber.Ctx) error {
    var req CreateTaskRequest
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
    }
    
    task, err := h.service.CreateTask(req)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": err.Error()})
    }
    
    return c.Status(201).JSON(task)
}
```

### 2. **Repository Pattern**

```typescript
// repositories/base.repository.ts
interface BaseRepository<T> {
  findAll(): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(item: Omit<T, 'id'>): Promise<T>
  update(id: string, item: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}

// repositories/user.repository.ts
class UserRepository implements BaseRepository<User> {
  private db: Database
  
  constructor(db: Database) {
    this.db = db
  }
  
  async findAll(): Promise<User[]> {
    return this.db.query('SELECT * FROM users')
  }
  
  async findById(id: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    )
    return result[0] || null
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    return result[0] || null
  }
  
  async create(user: Omit<User, 'id'>): Promise<User> {
    const id = uuid()
    await this.db.query(
      'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
      [id, user.name, user.email]
    )
    return { id, ...user }
  }
  
  async update(id: string, updates: Partial<User>): Promise<User> {
    await this.db.query(
      'UPDATE users SET ? WHERE id = ?',
      [updates, id]
    )
    return this.findById(id)
  }
  
  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM users WHERE id = ?', [id])
  }
}
```

### 3. **Service Layer Pattern**

```typescript
// services/task.service.ts
class TaskService {
  constructor(
    private taskRepo: TaskRepository,
    private userRepo: UserRepository,
    private eventBus: EventBus
  ) {}
  
  async createTask(userId: string, data: CreateTaskDto): Promise<Task> {
    // Validar que el usuario existe
    const user = await this.userRepo.findById(userId)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }
    
    // Crear tarea
    const task = await this.taskRepo.create({
      ...data,
      userId,
      status: 'pending',
      createdAt: new Date()
    })
    
    // Emitir evento
    this.eventBus.emit('task:created', {
      taskId: task.id,
      userId,
      title: task.title
    })
    
    return task
  }
  
  async assignTask(taskId: string, assigneeId: string): Promise<Task> {
    const task = await this.taskRepo.findById(taskId)
    if (!task) {
      throw new Error('Tarea no encontrada')
    }
    
    const assignee = await this.userRepo.findById(assigneeId)
    if (!assignee) {
      throw new Error('Usuario asignado no encontrado')
    }
    
    const updatedTask = await this.taskRepo.update(taskId, {
      assigneeId,
      status: 'in_progress'
    })
    
    this.eventBus.emit('task:assigned', {
      taskId,
      assigneeId,
      assigneeName: assignee.name
    })
    
    return updatedTask
  }
}
```

## 🎯 Conclusiones

Los patrones implementados demuestran:

1. **Comprensión profunda** de soluciones probadas
2. **Aplicación práctica** en contextos reales
3. **Balance** entre complejidad y simplicidad
4. **Flexibilidad** para cambios futuros
5. **Código más mantenible** y testeable

Cada patrón se eligió por razones específicas y se implementó considerando el contexto y necesidades del proyecto.