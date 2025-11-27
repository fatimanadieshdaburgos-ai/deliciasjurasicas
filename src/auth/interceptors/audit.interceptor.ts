import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(private prisma: PrismaService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { user, method, body, params, url } = request;

        // Solo auditar si hay usuario autenticado
        if (!user) {
            return next.handle();
        }

        // Extraer tabla del URL
        const tableName = this.extractTableName(url);

        // Acciones a auditar
        const actionsToAudit = ['POST', 'PATCH', 'PUT', 'DELETE'];

        if (!actionsToAudit.includes(method)) {
            return next.handle();
        }

        return next.handle().pipe(
            tap(async () => {
                try {
                    await this.prisma.auditLog.create({
                        data: {
                            userId: user.id,
                            action: method,
                            tableName,
                            recordId: params.id || null,
                            newData: body || null,
                            ipAddress: request.ip || request.connection.remoteAddress,
                            userAgent: request.get('user-agent') || null,
                        },
                    });
                } catch (error) {
                    // Log error but don't fail the request
                    console.error('Error creating audit log:', error);
                }
            }),
        );
    }

    private extractTableName(url: string): string {
        // Extraer el nombre de la tabla del URL
        // /api/v1/products/123 -> products
        const parts = url.split('/').filter((p) => p);
        return parts[2] || 'unknown';
    }
}
