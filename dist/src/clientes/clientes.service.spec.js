"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const clientes_service_1 = require("./clientes.service");
describe('ClientesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [clientes_service_1.ClientesService],
        }).compile();
        service = module.get(clientes_service_1.ClientesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=clientes.service.spec.js.map