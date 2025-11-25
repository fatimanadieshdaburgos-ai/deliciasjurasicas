export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Delicias Jurásicas</h3>
                        <p className="text-gray-400 text-sm">
                            Pastelería y cafetería temática con los mejores pasteles
                            inspirados en dinosaurios.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/shop" className="hover:text-white transition">Tienda</a></li>
                            <li><a href="/about" className="hover:text-white transition">Sobre Nosotros</a></li>
                            <li><a href="/contact" className="hover:text-white transition">Contacto</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>📞 555-1234-5678</li>
                            <li>📧 info@deliciasjurasicas.com</li>
                            <li>📍 Av. Principal 123, CDMX</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                    <p>&copy; 2024 Delicias Jurásicas. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
