"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClienteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateClienteDto {
    name;
    email;
    telefono;
    tenantID;
    fecha_registro;
}
exports.CreateClienteDto = CreateClienteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: 'John Doe' }),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: 'cliente@.com' }),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: '1234566' }),
    __metadata("design:type", Int16Array)
], CreateClienteDto.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: 1, description: 'ID del Tenant' }),
    __metadata("design:type", Number)
], CreateClienteDto.prototype, "tenantID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, example: '12/12/25' }),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "fecha_registro", void 0);
//# sourceMappingURL=create-cliente.dto.js.map