export default function CashBox() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Control de Caja</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Cash Box */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Caja Actual</h2>
                    <div className="alert alert-info mb-4">
                        No hay ninguna caja abierta en este momento
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="form-label">Monto Inicial</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="$0.00"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="form-label">Número de Caja</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="CAJA-001"
                            />
                        </div>

                        <button className="btn btn-primary w-full">
                            Abrir Caja
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="card bg-gray-50">
                    <h2 className="text-xl font-semibold mb-4">Cómo Funciona</h2>
                    <ol className="space-y-3 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="font-bold">1.</span>
                            <div>
                                <strong>Abrir Caja:</strong> Registra el monto inicial con el que comienzas el día
                            </div>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">2.</span>
                            <div>
                                <strong>Registrar Ventas:</strong> Todas las ventas del POS se registran automáticamente
                            </div>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">3.</span>
                            <div>
                                <strong>Movimientos de Efectivo:</strong> Registra entradas/salidas de dinero no relacionadas con ventas
                            </div>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">4.</span>
                            <div>
                                <strong>Cerrar Caja:</strong> Al final del día, cuenta el efectivo real y el sistema calculará las diferencias
                            </div>
                        </li>
                    </ol>

                    <div className="mt-6 p-4 bg-white rounded border border-gray-200">
                        <h3 className="font-semibold mb-2">Arqueo de Caja</h3>
                        <p className="text-sm text-gray-600">
                            El sistema calculará automáticamente:
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                            <li>• Monto esperado = Inicial + Ventas + Transacciones</li>
                            <li>• Diferencia = Monto real - Monto esperado</li>
                            <li>• Reporte de faltantes o sobrantes</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Recent Cash Boxes */}
            <div className="card mt-6">
                <h2 className="text-xl font-semibold mb-4">Historial de Cajas</h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Número de Caja</th>
                                <th>Usuario</th>
                                <th>Apertura</th>
                                <th>Cierre</th>
                                <th>Monto Inicial</th>
                                <th>Monto Final</th>
                                <th>Diferencia</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-gray-500">
                                    No hay registros de cajas
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
