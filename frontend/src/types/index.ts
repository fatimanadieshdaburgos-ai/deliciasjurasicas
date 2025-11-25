// ============================================
// USER & AUTH TYPES
// ============================================

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    lastLoginAt?: string;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    VENDEDOR = 'VENDEDOR',
    PANADERO = 'PANADERO',
    REPARTIDOR = 'REPARTIDOR',
    CLIENTE = 'CLIENTE',
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

// ============================================
// PRODUCT TYPES
// ============================================

export interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string;
    type: ProductType;
    currentStock: number;
    minStock?: number;
    maxStock?: number;
    measureUnit: MeasureUnit;
    salePrice?: number;
    costPrice?: number;
    isActive: boolean;
    isFeatured: boolean;
    category?: Category;
    images?: ProductImage[];
    recipe?: Recipe;
    createdAt: string;
    updatedAt: string;
}

export interface Recipe {
    id: string;
    yieldQuantity: number;
    yieldUnit: string;
    preparationTime: number;
    ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
    id: string;
    quantity: number;
    unit: string;
    ingredient: {
        id: string;
        name: string;
    };
}

export enum ProductType {
    INSUMO = 'INSUMO',
    PRODUCTO_TERMINADO = 'PRODUCTO_TERMINADO',
    SEMI_ELABORADO = 'SEMI_ELABORADO',
}

export enum MeasureUnit {
    KG = 'KG',
    GR = 'GR',
    LT = 'LT',
    ML = 'ML',
    UN = 'UN',
    DOC = 'DOC',
    PZA = 'PZA',
}

export interface ProductImage {
    id: string;
    url: string;
    altText?: string;
    isPrimary: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    isActive: boolean;
}

export interface ProductFilter {
    page?: number;
    limit?: number;
    type?: ProductType;
    isActive?: boolean;
    isFeatured?: boolean;
    categoryId?: string;
    search?: string;
}

// ============================================
// CART TYPES
// ============================================

export interface Cart {
    id: string;
    userId?: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    id: string;
    cartId: string;
    product: Product;
    quantity: number;
    createdAt: string;
}

// ============================================
// ORDER TYPES
// ============================================

export interface Order {
    id: string;
    orderNumber: string;
    type: OrderType;
    status: OrderStatus;
    customer?: User;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    items: OrderItem[];
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    taxAmount: number;
    total: number;
    paymentMethod?: PaymentMethod;
    paymentStatus?: string;
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
}

export enum OrderType {
    ONLINE = 'ONLINE',
    POS = 'POS',
    PHONE = 'PHONE',
}

export enum OrderStatus {
    DRAFT = 'DRAFT',
    PENDING = 'PENDING',
    PAID = 'PAID',
    IN_PRODUCTION = 'IN_PRODUCTION',
    READY = 'READY',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    TRANSFER = 'TRANSFER',
    PAYPAL = 'PAYPAL',
    MERCADOPAGO = 'MERCADOPAGO',
}

export interface OrderItem {
    id: string;
    product: Product;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    discountAmount: number;
    total: number;
}

export interface CreateOrderDto {
    type: OrderType;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    items: {
        productId: string;
        quantity: number;
        unitPrice: number;
    }[];
    subtotal: number;
    total: number;
}

// ============================================
// PRODUCTION TYPES
// ============================================

export interface ProductionOrder {
    id: string;
    orderNumber: string;
    productId: string;
    quantity: number;
    status: ProductionStatus;
    assignedTo?: User;
    scheduledDate?: string;
    startedAt?: string;
    completedAt?: string;
    createdAt: string;
    notes?: string;
}

export enum ProductionStatus {
    PENDIENTE = 'PENDIENTE',
    EN_PROCESO = 'EN_PROCESO',
    COMPLETADO = 'COMPLETADO',
    CANCELADO = 'CANCELADO',
}

export interface CreateProductionOrderDto {
    productId: string;
    quantity: number;
    scheduledDate?: string;
    assignedToId?: string;
    notes?: string;
}

// ============================================
// INVENTORY TYPES
// ============================================

export interface StockItem {
    id: string;
    sku: string;
    name: string;
    type: ProductType;
    currentStock: number;
    minStock?: number;
    maxStock?: number;
    measureUnit: MeasureUnit;
}

export interface StockMovement {
    id: string;
    product: Product;
    type: MovementType;
    quantity: number;
    previousStock: number;
    newStock: number;
    notes?: string;
    createdAt: string;
}

export enum MovementType {
    COMPRA = 'COMPRA',
    PRODUCCION_ENTRADA = 'PRODUCCION_ENTRADA',
    PRODUCCION_SALIDA = 'PRODUCCION_SALIDA',
    VENTA = 'VENTA',
    AJUSTE_POSITIVO = 'AJUSTE_POSITIVO',
    AJUSTE_NEGATIVO = 'AJUSTE_NEGATIVO',
    DEVOLUCION = 'DEVOLUCION',
}

// ============================================
// COMMON TYPES
// ============================================

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ApiError {
    message: string;
    statusCode: number;
    error: string;
}
