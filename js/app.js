console.log("MusaApp: ARCHIVO JS CARGADO CORRECTAMENTE");

// Objeto Global de la App
window.musaApp = {
    authListenerAttached: false,
    components: {},
    views: {},

    init: function() {
        console.log("MusaApp: Iniciando aplicación...");
        
        // Referencias UI
        this.navItems = document.querySelectorAll('.nav-item');
        this.loginOverlay = document.getElementById('login-overlay');
        this.loginEmailInput = document.getElementById('login-email');
        this.loginKeyInput = document.getElementById('login-key');
        this.btnLogin = document.getElementById('btn-login');

        this.views = {
            portfolio: document.getElementById('view-portfolio'),
            dashboard: document.getElementById('view-dashboard'),
            projects: document.getElementById('view-projects'),
            clients: document.getElementById('view-clients'),
            budget: document.getElementById('view-budget'),
            planning: document.getElementById('view-planning')
        };
        
        try {
            this.components = {
                portfolio: new window.PortfolioView(this.views.portfolio),
                dashboard: new window.DashboardView(this.views.dashboard),
                projects: new window.ProjectManagerView(this.views.projects),
                clients: new window.ClientManagerView(this.views.clients),
                budget: new window.BudgetView(this.views.budget),
                planning: new window.PlanningView(this.views.planning)
            };
        } catch (e) {
            console.error("MusaApp: Error instanciando componentes:", e);
        }

        this.initLogin();
    },

    initLogin: function() {
        console.log("MusaApp: Configurando Login...");
        if (!this.btnLogin || !this.loginOverlay) return;

        const setupListener = () => {
            if (window.firebase && window.state && !this.authListenerAttached) {
                console.log("MusaApp: Conectando detector de sesión...");
                window.state.initFirebaseAppOnly();
                const auth = window.state.auth;
                if (auth) {
                    window.firebase.onAuthStateChanged(auth, (user) => {
                        console.log("MusaApp: Sesión detectada ->", user ? user.email : "CERRADA");
                        if (user) {
                            this.loginOverlay.style.display = 'none';
                            this.enterApp();
                        } else {
                            this.loginOverlay.style.display = 'flex';
                        }
                    });
                    this.authListenerAttached = true;
                    return true;
                }
            }
            return false;
        };

        setupListener();
        setTimeout(setupListener, 1000);
        setTimeout(setupListener, 3000);

        this.btnLogin.addEventListener('click', () => {
            console.log("MusaApp: Click en Entrar.");
            const email = this.loginEmailInput.value.trim();
            const pwd = this.loginKeyInput.value.trim();
            if (!email || !pwd) { alert("Introduce datos"); return; }
            
            this.btnLogin.disabled = true;
            this.btnLogin.textContent = "Conectando...";

            window.firebase.signInWithEmailAndPassword(window.state.auth, email, pwd)
                .then(() => {
                    this.btnLogin.textContent = "¡Entrando!";
                    setTimeout(() => { this.loginOverlay.style.display = 'none'; this.enterApp(); }, 500);
                })
                .catch(err => {
                    this.btnLogin.disabled = false;
                    this.btnLogin.textContent = "Entrar";
                    alert("Error: " + err.message);
                });
        });
    },

    enterApp: function() {
        if (window.state && window.firebase) {
            window.state.initFirebase().then(() => {
                this.startMainUI();
            });
        } else {
            this.startMainUI();
        }
    },

    startMainUI: function() {
        console.log("MusaApp: Cargando Interfaz Principal...");
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchView(item.getAttribute('data-view'));
            });
        });

        if (window.state) {
            window.state.subscribe((data, projectList, clientList) => {
                this.updateGlobalUI(data);
                this.updatePrintFields(data, clientList);
                const activeNav = document.querySelector('.nav-item.active');
                if (activeNav) {
                    const viewName = activeNav.getAttribute('data-view');
                    if (viewName === 'projects') this.components.projects.render(data, projectList);
                    else if (viewName === 'clients') this.components.clients.render(data, projectList, clientList);
                    else if (this.components[viewName]) this.components[viewName].render(data);
                }
            });
        }

        const btnSave = document.getElementById('btn-save');
        if (btnSave) btnSave.addEventListener('click', () => {
            window.state.saveAll();
            btnSave.textContent = '¡Guardado!';
            setTimeout(() => btnSave.textContent = 'Guardar Cambios', 2000);
        });

        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) btnLogout.addEventListener('click', () => {
            if (confirm("¿Cerrar sesión?")) {
                window.firebase.signOut(window.state.auth).then(() => location.reload());
            }
        });

        const btnNewQuick = document.getElementById('btn-new-project-quick');
        if (btnNewQuick) btnNewQuick.addEventListener('click', () => {
            const name = prompt('Nombre del nuevo presupuesto:', 'Nuevo Presupuesto');
            if (name) {
                window.state.createNewProject(name);
                this.switchView('budget');
            }
        });

        const btnExcel = document.getElementById('btn-export-excel');
        if (btnExcel) btnExcel.addEventListener('click', () => {
            if (!window.state.data) { alert('No hay proyecto activo.'); return; }
            if (typeof XLSX === 'undefined') { alert('La librería XLSX aún se está cargando. Por favor, espera un segundo.'); return; }
            
            const d = window.state.data;
            const wb = XLSX.utils.book_new();

            // Hoja 1: Información
            const infoData = [
                ['DATOS DEL PROYECTO'],
                ['Nombre', d.project.name],
                ['Presupuesto Total', d.project.total.toFixed(2) + ' €'],
                ['Fecha Exportación', new Date().toLocaleDateString('es-ES')]
            ];
            const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
            XLSX.utils.book_append_sheet(wb, wsInfo, "Información");

            // Hoja 2: Resumen Capítulos
            const resumenData = [['Capítulo', 'Título', 'Total (€)']];
            d.chapters.forEach(c => {
                resumenData.push([c.order, c.title, c.total.toFixed(2)]);
            });
            resumenData.push(['', 'TOTAL GENERAL', d.project.total.toFixed(2)]);
            const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
            XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen Capítulos");

            // Hoja 3: Detalle
            const detalleData = [['Capítulo', 'Partida', 'Descripción Corta', 'Descripción Larga', 'Unidad', 'Cantidad', 'Precio (€)', 'Importe (€)']];
            d.chapters.forEach(c => {
                c.items.forEach(i => {
                    detalleData.push([c.title, i.order, i.descShort, i.descLong, i.unit, i.qty.toFixed(2), i.price.toFixed(2), i.total.toFixed(2)]);
                });
            });
            detalleData.push(['', '', '', '', '', '', 'TOTAL', d.project.total.toFixed(2)]);
            const wsDetalle = XLSX.utils.aoa_to_sheet(detalleData);
            XLSX.utils.book_append_sheet(wb, wsDetalle, "Presupuesto Detallado");

            // Generar y descargar
            XLSX.writeFile(wb, (d.project.name || 'presupuesto') + '.xlsx');
        });

        const btnPdf = document.getElementById('btn-export-pdf');
        if (btnPdf) btnPdf.addEventListener('click', () => {
            if (!window.state.data) { alert('No hay proyecto activo.'); return; }
            const d = window.state.data;
            const container = document.getElementById('pdf-report-container');
            
            let html = `
                <!-- PORTADA / INFORMACIÓN -->
                <div style="page-break-after: always; display: flex; flex-direction: column; justify-content: center; min-height: 100vh; padding: 2rem;">
                    <h1 style="font-size: 3rem; margin-bottom: 2rem; color: #111827;">${d.project.name}</h1>
                    <div style="font-size: 1.2rem; color: #4B5563; margin-bottom: 1rem;"><strong>Fecha de Generación:</strong> ${new Date().toLocaleDateString('es-ES')}</div>
                    <div style="font-size: 1.5rem; color: var(--primary); font-weight: 800; margin-top: 2rem;">Presupuesto Total: ${d.project.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</div>
                </div>

                <!-- RESUMEN DE CAPÍTULOS -->
                <div style="page-break-after: always; padding: 2rem;">
                    <h2 style="font-size: 2rem; margin-bottom: 2rem; border-bottom: 2px solid #000; padding-bottom: 0.5rem;">Resumen de Presupuesto</h2>
                    <table style="width: 100%; border-collapse: collapse; font-size: 1.1rem;">
                        <thead>
                            <tr style="border-bottom: 2px solid #000; text-align: left;">
                                <th style="padding: 10px 0;">Capítulo</th>
                                <th style="padding: 10px 0;">Título</th>
                                <th style="padding: 10px 0; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${d.chapters.map(c => `
                                <tr style="border-bottom: 1px solid #ccc;">
                                    <td style="padding: 10px 0;">${c.order}</td>
                                    <td style="padding: 10px 0;">${c.title}</td>
                                    <td style="padding: 10px 0; text-align: right;">${c.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr style="font-weight: bold; font-size: 1.3rem;">
                                <td colspan="2" style="padding: 20px 0; text-align: right;">TOTAL GENERAL:</td>
                                <td style="padding: 20px 0; text-align: right;">${d.project.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- PRESUPUESTO DETALLADO -->
                <div style="padding: 2rem;">
                    <h2 style="font-size: 2rem; margin-bottom: 2rem; border-bottom: 2px solid #000; padding-bottom: 0.5rem;">Presupuesto Detallado</h2>
                    ${d.chapters.map(c => `
                        <div style="margin-bottom: 30px; page-break-inside: avoid;">
                            <div style="background: #f1f5f9; padding: 10px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">CAPÍTULO ${c.order} - ${c.title}</div>
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                                <thead>
                                    <tr style="border-bottom: 1px solid #000; text-align: left;">
                                        <th style="padding: 5px; width: 60px;">Ord</th>
                                        <th style="padding: 5px;">Descripción</th>
                                        <th style="padding: 5px; text-align: right; width: 60px;">Ud</th>
                                        <th style="padding: 5px; text-align: right; width: 80px;">Cant.</th>
                                        <th style="padding: 5px; text-align: right; width: 100px;">Precio</th>
                                        <th style="padding: 5px; text-align: right; width: 100px;">Importe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${c.items.map(i => `
                                        <tr style="border-bottom: 1px solid #eee;">
                                            <td style="padding: 8px 5px; vertical-align: top;">${i.order}</td>
                                            <td style="padding: 8px 5px; vertical-align: top;">
                                                <div style="font-weight: bold;">${i.descShort}</div>
                                                <div style="font-size: 0.8rem; color: #555; margin-top: 4px;">${i.descLong === 'Añadir descripción detallada de la partida...' ? '' : (i.descLong || '')}</div>
                                            </td>
                                            <td style="padding: 8px 5px; text-align: right; vertical-align: top;">${i.unit}</td>
                                            <td style="padding: 8px 5px; text-align: right; vertical-align: top;">${i.qty.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
                                            <td style="padding: 8px 5px; text-align: right; vertical-align: top;">${i.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td>
                                            <td style="padding: 8px 5px; text-align: right; vertical-align: top; font-weight: bold;">${i.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            <div style="text-align: right; padding: 10px; font-weight: bold; border-top: 1px solid #ccc; margin-top: 5px;">Total Capítulo ${c.order}: ${c.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.innerHTML = html;
            container.style.display = 'block';
            
            setTimeout(() => {
                window.print();
                setTimeout(() => { container.style.display = 'none'; }, 1000);
            }, 100);
        });

        this.switchView('portfolio');
    },

    switchView: function(viewName) {
        this.navItems.forEach(item => {
            if (item.getAttribute('data-view') === viewName) item.classList.add('active');
            else item.classList.remove('active');
        });
        Object.keys(this.views).forEach(name => {
            this.views[name].style.display = (name === viewName) ? 'block' : 'none';
            if (name === viewName && window.state) this.components[name].render(window.state.data, window.state.projects, window.state.clients);
        });
        if (window.lucide) lucide.createIcons();
    },

    updateGlobalUI: function(data) {
        if (!data || !data.project) return;
        const totalVal = document.getElementById('project-total-val');
        if (totalVal) totalVal.textContent = (data.project.total || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 });
    },

    updatePrintFields: function(data, clientList) {
        // ... (resto de funciones de renderizado, simplificadas para brevedad)
    }
};

// Arrancar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.musaApp.init());
} else {
    window.musaApp.init();
}
