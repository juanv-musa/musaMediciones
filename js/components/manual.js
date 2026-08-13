/**
 * MusaMediciones Manual Component
 */

class ManualView {
    constructor(container) {
        this.container = container;
        this.rendered = false;
    }

    render() {
        if (this.rendered) return;

        this.container.innerHTML = `
            <div class="manual-view view-container" style="animation: fadeIn 0.4s ease-out; max-width: 1000px; margin: 0 auto;">
                
                <div style="text-align: center; margin-bottom: 3rem;">
                    <h2 style="font-weight: 800; font-size: 2.8rem; color: var(--text-primary); margin-bottom: 0.5rem;">Manual de Uso</h2>
                    <p style="color: var(--text-secondary); font-size: 1.1rem;">Guía paso a paso para dominar MusaMediciones</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
                    
                    <!-- 1. Inicio de Sesión -->
                    <div class="glass" style="padding: 2.5rem; border-radius: var(--radius-xl); background: white; border-left: 5px solid var(--primary);">
                        <h3 style="display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 1.5rem;">
                            <i data-lucide="log-in" style="width: 24px; height: 24px;"></i> 1. Acceso a la Plataforma
                        </h3>
                        <p style="color: var(--text-primary); line-height: 1.7; margin-bottom: 1rem;">
                            Al entrar en la web, verás una pantalla de inicio de sesión borrosa al fondo. Solo necesitas introducir tu <strong>Correo Electrónico</strong> y tu <strong>Contraseña</strong> y pulsar en "Entrar".
                        </p>
                        <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">
                            <em>Nota: Si olvidas la contraseña, pulsa en "¿Olvidaste tu contraseña?", introduce tu correo y se te enviará un enlace de restablecimiento al email. La app recordará automáticamente tu último correo utilizado para hacerte el acceso más rápido.</em>
                        </p>
                    </div>

                    <!-- 2. Visión Global y Proyectos -->
                    <div class="glass" style="padding: 2.5rem; border-radius: var(--radius-xl); background: white; border-left: 5px solid #0ea5e9;">
                        <h3 style="display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-weight: 700; color: #0ea5e9; margin-bottom: 1.5rem;">
                            <i data-lucide="pie-chart" style="width: 24px; height: 24px;"></i> 2. Visión Global y Mis Proyectos
                        </h3>
                        <p style="color: var(--text-primary); line-height: 1.7; margin-bottom: 1rem;">
                            Una vez dentro, el menú izquierdo será tu centro de mandos:
                        </p>
                        <ul style="list-style: none; padding-left: 0; line-height: 1.8;">
                            <li style="margin-bottom: 0.5rem;"><strong style="color: var(--text-primary);">Visión Global:</strong> Muestra un resumen de todos tus proyectos, el dinero total gestionado, márgenes de beneficio y cuánto se ha gastado realmente en toda la cartera de proyectos.</li>
                            <li style="margin-bottom: 0.5rem;"><strong style="color: var(--text-primary);">Mis Proyectos:</strong> Aquí puedes ver el listado de todos tus proyectos (en curso, finalizados, etc.). Puedes <strong>Crear un nuevo presupuesto</strong> desde aquí (o desde el botón '+' rápido arriba a la derecha). Para abrir un proyecto, haz clic en "Cargar", y todos los demás apartados se actualizarán con los datos de ese proyecto.</li>
                            <li><strong style="color: var(--text-primary);">Clientes:</strong> Un directorio o base de datos de tus clientes. Puedes crearlos, editarlos y luego asignarlos al proyecto que corresponda.</li>
                        </ul>
                    </div>

                    <!-- 3. Dashboard del Proyecto -->
                    <div class="glass" style="padding: 2.5rem; border-radius: var(--radius-xl); background: white; border-left: 5px solid #8b5cf6;">
                        <h3 style="display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-weight: 700; color: #8b5cf6; margin-bottom: 1.5rem;">
                            <i data-lucide="layout-dashboard" style="width: 24px; height: 24px;"></i> 3. Dashboard del Proyecto
                        </h3>
                        <p style="color: var(--text-primary); line-height: 1.7; margin-bottom: 1rem;">
                            Esta pantalla es el "resumen ejecutivo" del proyecto que tienes cargado actualmente.
                        </p>
                        <ul style="list-style: none; padding-left: 0; line-height: 1.8;">
                            <li style="margin-bottom: 0.5rem;">Verás de un vistazo el <strong>Presupuesto Total</strong>, la <strong>Duración Prevista</strong> y el porcentaje de tareas con cantidad mayor a cero.</li>
                            <li style="margin-bottom: 0.5rem;">Un gráfico de barras te indica qué <strong>Capítulos</strong> se llevan la mayor parte del presupuesto (Distribución por Capítulos).</li>
                            <li>En <strong>Estado del Proyecto</strong> puedes definir manualmente el porcentaje de progreso de obra, el hito actual (ej. "Fase 1/4"), la fecha límite y el riesgo. Esto se guardará en el proyecto para llevar un control visual rápido.</li>
                        </ul>
                    </div>

                    <!-- 4. El Presupuesto (El corazón de la app) -->
                    <div class="glass" style="padding: 2.5rem; border-radius: var(--radius-xl); background: white; border-left: 5px solid #10b981;">
                        <h3 style="display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-weight: 700; color: #10b981; margin-bottom: 1.5rem;">
                            <i data-lucide="calculator" style="width: 24px; height: 24px;"></i> 4. Cómo Completar los Registros (Presupuesto)
                        </h3>
                        <p style="color: var(--text-primary); line-height: 1.7; margin-bottom: 1rem;">
                            La vista "Presupuesto" es donde trabajarás el 90% del tiempo. Funciona con una jerarquía de 3 niveles: <strong>Capítulos > Partidas > Mediciones</strong>.
                        </p>
                        
                        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid var(--border);">
                            <h4 style="font-weight: 700; margin-bottom: 0.5rem;">Capítulos</h4>
                            <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">
                                Son los bloques grandes (ej. <em>"01. Demoliciones"</em>). Pulsa el botón "Añadir Capítulo" abajo del todo para crear uno nuevo. En la cabecera de cada capítulo, verás su total en dinero y la opción para establecer un <strong>Gasto Real</strong> (lo que realmente te ha costado), lo que mostrará la <em>desviación</em>.
                            </p>
                        </div>

                        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid var(--border);">
                            <h4 style="font-weight: 700; margin-bottom: 0.5rem;">Partidas (Los "Items")</h4>
                            <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">
                                Dentro de cada capítulo añades partidas (ej. <em>"Demolición de tabique"</em>). Cada partida tiene:
                                <ul style="margin-top: 0.5rem; margin-bottom: 0.5rem; padding-left: 1.5rem;">
                                    <li><strong>Unidad:</strong> ej. "m2", "ud", "m".</li>
                                    <li><strong>Descripción Corta:</strong> El nombre principal de la partida.</li>
                                    <li><strong>Descripción Larga:</strong> Al pulsar el pequeño botón de "documento" <i data-lucide="file-text" style="width:14px; display:inline;"></i> junto a la descripción corta, se despliega un área de texto enorme para explicar al detalle cómo se hace la ejecución.</li>
                                    <li><strong>Precio:</strong> El precio unitario.</li>
                                </ul>
                            </p>
                        </div>

                        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid var(--border);">
                            <h4 style="font-weight: 700; margin-bottom: 0.5rem;">Mediciones (Desglose)</h4>
                            <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">
                                En lugar de poner la cantidad (Cantidad Total) a mano, puedes pulsar el botón <strong>"+ Añadir Medición"</strong>. Aparecerán unas filas donde puedes especificar:
                                <em>Largo, Ancho, Alto</em> y las <em>Unidades</em>. 
                                <br><br>
                                El sistema multiplicará todo automáticamente para darte el total de esa línea. Todas las líneas de medición de una partida se suman y forman la <strong>Cantidad Total</strong> de la partida.
                            </p>
                        </div>

                        <p style="color: var(--text-primary); line-height: 1.7;">
                            <strong>¡Importante!:</strong> No te olvides de revisar los porcentajes al final de la página (Gastos Generales, Beneficio Industrial e IVA) para que el Total General (PEC) sea correcto.
                        </p>
                    </div>

                    <!-- 5. Fechas y Planificación -->
                    <div class="glass" style="padding: 2.5rem; border-radius: var(--radius-xl); background: white; border-left: 5px solid #f59e0b;">
                        <h3 style="display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-weight: 700; color: #f59e0b; margin-bottom: 1.5rem;">
                            <i data-lucide="calendar-range" style="width: 24px; height: 24px;"></i> 5. Fechas de Planificación (Gantt)
                        </h3>
                        <p style="color: var(--text-primary); line-height: 1.7; margin-bottom: 1rem;">
                            En la pestaña "Planificación", el sistema coge todos los Capítulos y Partidas que has creado en tu presupuesto y te los muestra en formato de calendario o Diagrama de Gantt.
                        </p>
                        <ul style="list-style: none; padding-left: 0; line-height: 1.8;">
                            <li style="margin-bottom: 0.5rem;">Puedes asignar una <strong>Fecha de Inicio</strong> y una <strong>Fecha de Fin</strong> a cada partida directamente allí.</li>
                            <li style="margin-bottom: 0.5rem;">A la derecha verás una línea de tiempo (timeline) que se dibuja automáticamente y te permite visualizar visualmente cuándo empieza y acaba cada trabajo.</li>
                            <li>Arriba de la planificación, debes establecer la <strong>Fecha de Inicio de Obra</strong>, que servirá como punto de partida (Día 0) para el cronograma.</li>
                        </ul>
                    </div>

                    <!-- 6. Exportar y Guardar -->
                    <div class="glass" style="padding: 2.5rem; border-radius: var(--radius-xl); background: white; border-left: 5px solid #ec4899;">
                        <h3 style="display: flex; align-items: center; gap: 10px; font-size: 1.5rem; font-weight: 700; color: #ec4899; margin-bottom: 1.5rem;">
                            <i data-lucide="download" style="width: 24px; height: 24px;"></i> 6. Guardar y Exportar
                        </h3>
                        <p style="color: var(--text-primary); line-height: 1.7; margin-bottom: 1rem;">
                            En la esquina superior derecha siempre verás las opciones globales:
                        </p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                            <div style="padding: 1rem; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px;">
                                <h4 style="font-weight: 700; color: #be123c; margin-bottom: 0.5rem;"><i data-lucide="file-text" style="width:16px; margin-right:5px; vertical-align:middle;"></i> Exportar a PDF</h4>
                                <p style="font-size: 0.9rem; color: #881337; line-height: 1.5;">Genera un documento profesional listo para enviar. Puedes decidir si quieres incluir en el documento el detalle del "Gasto Real" o solo el presupuesto para el cliente.</p>
                            </div>
                            <div style="padding: 1rem; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px;">
                                <h4 style="font-weight: 700; color: #047857; margin-bottom: 0.5rem;"><i data-lucide="table" style="width:16px; margin-right:5px; vertical-align:middle;"></i> Exportar a Excel</h4>
                                <p style="font-size: 0.9rem; color: #065f46; line-height: 1.5;">Genera un archivo .xlsx muy parecido a Presto. Divide la info en pestañas: Portada, Mediciones al detalle, Resumen de capítulos, y Gasto Real.</p>
                            </div>
                        </div>
                        <div style="margin-top: 1.5rem; padding: 1.5rem; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
                            <strong style="color: #1d4ed8;">Botón Guardar Cambios:</strong> Acostúmbrate a pulsarlo a menudo, aunque el sistema intenta guardarlo en la nube. Sabrás que ha funcionado porque el botón cambiará a verde y dirá "¡Guardado!".
                        </div>
                    </div>

                </div>
            </div>
        `;

        if (window.lucide) {
            lucide.createIcons({
                root: this.container
            });
        }
        
        this.rendered = true;
    }
}

window.ManualView = ManualView;
