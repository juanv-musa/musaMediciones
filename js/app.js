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

// --- HELPER: Numero a Letras ---
function numeroALetras(num) {
    const Unidades = num => {
        switch(num) {
            case 1: return 'UN'; case 2: return 'DOS'; case 3: return 'TRES';
            case 4: return 'CUATRO'; case 5: return 'CINCO'; case 6: return 'SEIS';
            case 7: return 'SIETE'; case 8: return 'OCHO'; case 9: return 'NUEVE';
        }
        return '';
    };
    const Decenas = num => {
        let decena = Math.floor(num/10);
        let unidad = num - (decena * 10);
        switch(decena) {
            case 1:
                switch(unidad) {
                    case 0: return 'DIEZ'; case 1: return 'ONCE'; case 2: return 'DOCE';
                    case 3: return 'TRECE'; case 4: return 'CATORCE'; case 5: return 'QUINCE';
                    default: return 'DIECI' + Unidades(unidad);
                }
            case 2:
                switch(unidad) {
                    case 0: return 'VEINTE';
                    default: return 'VEINTI' + Unidades(unidad);
                }
            case 3: return DecenasY('TREINTA', unidad);
            case 4: return DecenasY('CUARENTA', unidad);
            case 5: return DecenasY('CINCUENTA', unidad);
            case 6: return DecenasY('SESENTA', unidad);
            case 7: return DecenasY('SETENTA', unidad);
            case 8: return DecenasY('OCHENTA', unidad);
            case 9: return DecenasY('NOVENTA', unidad);
            case 0: return Unidades(unidad);
        }
    };
    const DecenasY = (strSin, numUnidades) => {
        if (numUnidades > 0) return strSin + ' Y ' + Unidades(numUnidades)
        return strSin;
    };
    const Centenas = num => {
        let centenas = Math.floor(num / 100);
        let decenas = num - (centenas * 100);
        switch(centenas) {
            case 1:
                if (decenas > 0) return 'CIENTO ' + Decenas(decenas);
                return 'CIEN';
            case 2: return 'DOSCIENTOS ' + Decenas(decenas);
            case 3: return 'TRESCIENTOS ' + Decenas(decenas);
            case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
            case 5: return 'QUINIENTOS ' + Decenas(decenas);
            case 6: return 'SEISCIENTOS ' + Decenas(decenas);
            case 7: return 'SETECIENTOS ' + Decenas(decenas);
            case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
            case 9: return 'NOVECIENTOS ' + Decenas(decenas);
        }
        return Decenas(decenas);
    };
    const Seccion = (num, divisor, strSingular, strPlural) => {
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)
        let letras = '';
        if (cientos > 0)
            if (cientos > 1) letras = Centenas(cientos) + ' ' + strPlural;
            else letras = strSingular;
        if (resto > 0) letras += '';
        return letras;
    };
    const Miles = num => {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)
        let strMiles = Seccion(num, divisor, 'MIL', 'MIL');
        let strCentenas = Centenas(resto);
        if(strMiles == '') return strCentenas;
        return strMiles + ' ' + strCentenas;
    };
    const Millones = num => {
        let divisor = 1000000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)
        let strMillones = Seccion(num, divisor, 'UN MILLON', 'MILLONES');
        let strMiles = Miles(resto);
        if(strMillones == '') return strMiles;
        return strMillones + ' ' + strMiles;
    };
    if (num == 0) return 'CERO EUROS';
    let enteros = Math.floor(num);
    let centavos = Math.round((num - enteros) * 100);
    let letrasEnteros = Millones(enteros).trim();
    let letrasCentavos = '';
    if (centavos > 0) {
        let letrasCentavosPart = Decenas(centavos).trim();
        letrasCentavos = ' CON ' + letrasCentavosPart + (centavos === 1 ? ' CENTIMO' : ' CENTIMOS');
    }
    return letrasEnteros + (enteros === 1 ? ' EURO' : ' EUROS') + letrasCentavos;
}

        const btnExcel = document.getElementById('btn-export-excel');
        if (btnExcel) btnExcel.addEventListener('click', () => {
            if (!window.state.data) { alert('No hay proyecto activo.'); return; }
            if (typeof XLSX === 'undefined') { alert('La librería XLSX aún se está cargando. Por favor, espera un segundo.'); return; }
            
            const d = window.state.data;
            const wb = XLSX.utils.book_new();
            const p = d.project;

            // Hoja 1: Información
            const infoData = [
                ['MEDICIONES Y PRESUPUESTO'],
                [],
                ['PROYECTO:', p.name],
                ['SITUACION:', p.situation || ''],
                ['PROPIEDAD:', p.property || '']
            ];
            const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
            XLSX.utils.book_append_sheet(wb, wsInfo, "Portada");

            // Hoja 2: Detalle (Presto Style)
            const detalleData = [['Ord.', 'Descripción', 'Uds.', 'Largo', 'Ancho', 'Alto', 'Subtotal', 'Precio', 'Importe']];
            d.chapters.forEach(c => {
                detalleData.push([c.order, c.title, '', '', '', '', '', '', '']);
                c.items.forEach(i => {
                    detalleData.push([i.order, i.unit + '  ' + i.descShort, '', '', '', '', '', '', '']);
                    if (i.descLong && i.descLong !== 'Añadir descripción detallada de la partida...') {
                        detalleData.push(['', i.descLong, '', '', '', '', '', '', '']);
                    }
                    i.measurements.forEach(m => {
                        detalleData.push(['', m.desc || '', m.units, m.length, m.width, m.height, m.subtotal, '', '']);
                    });
                    detalleData.push(['', 'TOTAL PARTIDA ' + i.order, '', '', '', '', i.qty.toFixed(2), i.price.toFixed(2), i.total.toFixed(2)]);
                    detalleData.push(['', '', '', '', '', '', '', '', '']);
                });
                detalleData.push(['', 'TOTAL CAPÍTULO ' + c.order, '', '', '', '', '', '', c.total.toFixed(2)]);
                detalleData.push(['', '', '', '', '', '', '', '', '']);
            });
            const wsDetalle = XLSX.utils.aoa_to_sheet(detalleData);
            XLSX.utils.book_append_sheet(wb, wsDetalle, "Mediciones");

            // Hoja 3: Resumen
            const resumenData = [['Ord.', 'Descripción', 'Importe']];
            d.chapters.forEach(c => {
                resumenData.push([c.order, c.title, c.total.toFixed(2)]);
            });
            resumenData.push(['', '', '']);
            resumenData.push(['', 'SUMA EJECUCIÓN MATERIAL', p.pem.toFixed(2)]);
            resumenData.push(['', `Gastos generales ${p.expensesPct}%`, p.expensesTotal.toFixed(2)]);
            resumenData.push(['', `Beneficio industrial ${p.benefitPct}%`, p.benefitTotal.toFixed(2)]);
            resumenData.push(['', 'SUMA', p.pec.toFixed(2)]);
            resumenData.push(['', `I.V.A. ${p.taxPct}%`, p.taxTotal.toFixed(2)]);
            resumenData.push(['', 'Total presupuesto', p.total.toFixed(2)]);
            
            const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
            XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

            XLSX.writeFile(wb, (p.name || 'presupuesto') + '.xlsx');
        });

        const btnPdf = document.getElementById('btn-export-pdf');
        if (btnPdf) btnPdf.addEventListener('click', () => {
            if (!window.state.data) { alert('No hay proyecto activo.'); return; }
            const d = window.state.data;
            const p = d.project;
            const container = document.getElementById('pdf-report-container');
            
            let html = `
                <div style="font-family: 'Inter', Arial, sans-serif; font-size: 10pt; color: #000; background: #fff;">
                <!-- PORTADA -->
                <div style="page-break-after: always; padding: 40px;">
                    <h1 style="font-size: 24pt; font-weight: normal; margin-bottom: 60px;">MEDICIONES Y PRESUPUESTO</h1>
                    <div style="display: grid; grid-template-columns: 120px 1fr; gap: 20px; font-size: 11pt;">
                        <div style="font-weight: bold;">PROYECTO:</div>
                        <div>${p.name.toUpperCase()}</div>
                        <div style="font-weight: bold;">SITUACION:</div>
                        <div>${(p.situation || '').toUpperCase()}</div>
                        <div style="font-weight: bold;">PROPIEDAD:</div>
                        <div>${(p.property || '').toUpperCase()}</div>
                    </div>
                </div>

                <!-- MEDICIONES -->
                <div style="page-break-after: always;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
                        <thead>
                            <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
                                <th style="text-align: left; padding: 4px; width: 50px;">Ord.</th>
                                <th style="text-align: left; padding: 4px;">Descripción</th>
                                <th style="text-align: right; padding: 4px; width: 50px;">Uds.</th>
                                <th style="text-align: right; padding: 4px; width: 60px;">Largo</th>
                                <th style="text-align: right; padding: 4px; width: 60px;">Ancho</th>
                                <th style="text-align: right; padding: 4px; width: 60px;">Alto</th>
                                <th style="text-align: right; padding: 4px; width: 70px;">Subtotal</th>
                                <th style="text-align: right; padding: 4px; width: 70px;">Precio</th>
                                <th style="text-align: right; padding: 4px; width: 80px;">Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${d.chapters.map(c => `
                                <tr>
                                    <td style="padding: 8px 4px; font-weight: normal;">${c.order}</td>
                                    <td colspan="8" style="padding: 8px 4px; font-weight: normal;">${c.title.toUpperCase()}</td>
                                </tr>
                                ${c.items.map(i => `
                                    <tr>
                                        <td style="padding: 8px 4px; vertical-align: top;">${i.order}</td>
                                        <td style="padding: 8px 4px; vertical-align: top;">
                                            ${i.unit} &nbsp;&nbsp; ${i.descShort.toUpperCase()}<br>
                                            <div style="margin-top: 8px; color: #444; text-align: justify; padding-right: 20px;">
                                                ${i.descLong === 'Añadir descripción detallada de la partida...' ? '' : (i.descLong || '').replace(/\\n/g, '<br>')}
                                            </div>
                                        </td>
                                        <td colspan="7"></td>
                                    </tr>
                                    ${i.measurements.map(m => `
                                        <tr>
                                            <td></td>
                                            <td style="padding: 2px 4px;">${m.desc || ''}</td>
                                            <td style="padding: 2px 4px; text-align: right;">${m.units || ''}</td>
                                            <td style="padding: 2px 4px; text-align: right;">${m.length || ''}</td>
                                            <td style="padding: 2px 4px; text-align: right;">${m.width || ''}</td>
                                            <td style="padding: 2px 4px; text-align: right;">${m.height || ''}</td>
                                            <td style="padding: 2px 4px; text-align: right;">${m.subtotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td colspan="2"></td>
                                        </tr>
                                    `).join('')}
                                    <tr>
                                        <td colspan="2"></td>
                                        <td colspan="4" style="padding: 8px 4px; text-align: right;">TOTAL PARTIDA ${i.order}</td>
                                        <td style="padding: 8px 4px; text-align: right;">${i.qty.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td style="padding: 8px 4px; text-align: right;">${i.price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td style="padding: 8px 4px; text-align: right;">${i.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                    <tr><td colspan="9" style="height: 15px;"></td></tr>
                                `).join('')}
                                <tr>
                                    <td colspan="7"></td>
                                    <td style="padding: 8px 4px; text-align: right; font-weight: bold;">TOTAL CAPÍTULO ${c.order}</td>
                                    <td style="padding: 8px 4px; text-align: right; font-weight: bold;">${c.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                                <tr><td colspan="9" style="height: 30px;"></td></tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- RESUMEN -->
                <div style="padding: 40px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
                        <thead>
                            <tr style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
                                <th style="text-align: left; padding: 8px; width: 60px;">Ord.</th>
                                <th style="text-align: left; padding: 8px;">Descripción</th>
                                <th style="text-align: right; padding: 8px; width: 120px;">Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${d.chapters.map(c => `
                                <tr>
                                    <td style="padding: 8px;">${c.order}</td>
                                    <td style="padding: 8px;">${c.title.toUpperCase()}</td>
                                    <td style="padding: 8px; text-align: right;">${c.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div style="width: 400px; margin-left: auto; margin-top: 40px;">
                        <div style="display: grid; grid-template-columns: 1fr 100px; gap: 10px; padding: 4px 0;">
                            <div>SUMA EJECUCIÓN MATERIAL</div>
                            <div style="text-align: right;">${p.pem.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 100px; gap: 10px; padding: 4px 0;">
                            <div>Gastos generales ${p.expensesPct}%</div>
                            <div style="text-align: right;">${p.expensesTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 100px; gap: 10px; padding: 4px 0;">
                            <div>Beneficio industrial ${p.benefitPct}%</div>
                            <div style="text-align: right;">${p.benefitTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 100px; gap: 10px; padding: 12px 0;">
                            <div>SUMA</div>
                            <div style="text-align: right;">${p.pec.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 100px; gap: 10px; padding: 4px 0;">
                            <div>I.V.A. ${p.taxPct}%</div>
                            <div style="text-align: right;">${p.taxTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 100px; gap: 10px; padding: 12px 0; font-weight: bold;">
                            <div>Total presupuesto</div>
                            <div style="text-align: right;">${p.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                    </div>

                    <div style="margin-top: 60px; text-align: justify; font-size: 11pt;">
                        Asciende el presente documento a la expresada cantidad de<br>
                        <strong style="text-transform: uppercase;">${numeroALetras(p.total)}</strong>
                    </div>
                    
                    <div style="margin-top: 60px; text-align: center; text-transform: uppercase;">
                        ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                </div>
            `;
            
            container.innerHTML = html;
            container.style.display = 'block';
            
            setTimeout(() => {
                const afterPrintHandler = () => {
                    container.style.display = 'none';
                    container.innerHTML = '';
                    window.removeEventListener('afterprint', afterPrintHandler);
                };
                window.addEventListener('afterprint', afterPrintHandler);
                
                window.print();
            }, 300);
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
        if (totalVal) totalVal.textContent = (data.project.total || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
