/**
 * MusaMediciones Dashboard Component
 */

class DashboardView {
    constructor(container) {
        this.container = container;
    }

    render(data) {
        if (!data || !data.project) {
            this.container.innerHTML = '<div class="glass" style="padding: 2rem; text-align: center;">Cargando datos del proyecto...</div>';
            return;
        }
        const totalDuration = this.calculateTotalDuration(data);
        const completion = this.calculateCompletion(data);

        this.container.innerHTML = `
            <div class="dashboard-view view-container" style="animation: fadeIn 0.4s ease-out;">
                <h2 style="margin-bottom: 2rem; font-weight: 800; font-size: 2.2rem; color: var(--text-primary);">Dashboard del Proyecto</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
                    <div class="glass" style="padding: 2rem; border-radius: var(--radius-xl); border-bottom: 5px solid var(--primary); background: white;">
                        <div style="color: var(--text-secondary); font-size: 0.95rem; margin: 0 0 0.8rem 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Presupuesto Total</div>
                        <div style="font-size: 2.5rem; font-weight: 800; color: var(--primary);">${data.project.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</div>
                    </div>
                    <div class="glass" style="padding: 2rem; border-radius: var(--radius-xl); border-bottom: 5px solid var(--secondary); background: white;">
                        <div style="color: var(--text-secondary); font-size: 0.95rem; margin: 0 0 0.8rem 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Duración Prevista</div>
                        <div style="font-size: 2.5rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase;">${totalDuration} Días</div>
                    </div>
                    <div class="glass" style="padding: 2rem; border-radius: var(--radius-xl); border-bottom: 5px solid var(--primary); background: white;">
                        <div style="color: var(--text-secondary); font-size: 0.95rem; margin: 0 0 0.8rem 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tareas Completadas</div>
                        <div style="font-size: 2.5rem; font-weight: 800; color: var(--primary);">${completion}%</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
                    <div class="glass" style="padding: 2.5rem; border-radius: var(--radius-xl); background: white;">
                        <h3 style="margin-bottom: 2rem; font-size: 1.4rem; font-weight: 700;">Distribución por Capítulos</h3>
                        <div style="display: flex; flex-direction: column; gap: 1.5rem; max-height: 300px; overflow-y: auto; padding-right: 1rem;">
                            ${data.chapters.map(chapter => this.renderChapterBar(chapter, data.project.total)).join('')}
                        </div>
                    </div>
                    
                    <div class="glass" style="padding: 2.5rem; border-radius: var(--radius-xl); background: white;">
                        <h3 style="margin-bottom: 1.5rem; font-size: 1.4rem; font-weight: 700;"><i data-lucide="settings" style="width: 20px; vertical-align: middle; margin-right: 8px;"></i> Estado del Proyecto</h3>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                            <div>
                                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Porcentaje de Progreso (%)</label>
                                <input type="number" id="inp-progress" min="0" max="100" value="${data.project.progress || 0}" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border); background: #f8fafc; font-size: 1rem;">
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Hito Actual</label>
                                <input type="text" id="inp-milestone" value="${data.project.milestone || 'Fase Inicial'}" placeholder="Ej: Hito 1/4" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border); background: #f8fafc; font-size: 1rem;">
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Fecha Límite</label>
                                <input type="text" id="inp-deadline" value="${data.project.deadline || ''}" placeholder="Ej: 31 JULIO" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border); background: #f8fafc; font-size: 1rem;">
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Nivel de Riesgo</label>
                                <select id="sel-risk" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border); background: #f8fafc; font-size: 1rem;">
                                    <option value="Bajo" ${data.project.risk === 'Bajo' ? 'selected' : ''}>🟢 Bajo</option>
                                    <option value="Medio" ${data.project.risk === 'Medio' ? 'selected' : ''}>🟡 Medio</option>
                                    <option value="Alto" ${data.project.risk === 'Alto' ? 'selected' : ''}>🔴 Alto</option>
                                </select>
                            </div>
                            <div style="grid-column: 1 / -1;">
                                <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">Estado General</label>
                                <select id="sel-status" style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border); background: #f8fafc; font-size: 1rem;">
                                    <option value="En plazo" ${data.project.status === 'En plazo' ? 'selected' : ''}>En plazo</option>
                                    <option value="Cierre" ${data.project.status === 'Cierre' ? 'selected' : ''}>Cierre inminente</option>
                                    <option value="Retraso" ${data.project.status === 'Retraso' ? 'selected' : ''}>Retraso</option>
                                    <option value="Finalizado" ${data.project.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="glass" style="padding: 2.5rem; border-radius: var(--radius-xl); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: white; grid-column: 1 / -1;">
                        <div style="width: 80px; height: 80px; background: rgba(140, 198, 63, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                            <i data-lucide="printer" style="width: 40px; height: 40px; color: var(--primary);"></i>
                        </div>
                        <h3 style="margin-bottom: 0.5rem; font-size: 1.2rem;">Informe Ejecutivo</h3>
                        <p style="color: var(--text-secondary); line-height: 1.6; max-width: 300px;">Genera un informe completo en PDF con el resumen económico y los gráficos de distribución.</p>
                        <button id="btn-print-dashboard" class="btn-musa" style="margin-top: 2rem;">Imprimir Informe a PDF</button>
                    </div>
                </div>
            </div>
        `;

        this.addEventListeners();
        if (window.lucide) lucide.createIcons();
    }

    addEventListeners() {
        const btnPrint = this.container.querySelector('#btn-print-dashboard');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => {
                const data = window.state?.data;
                if (!data || !data.project) return;
                
                const p = data.project;
                const totalDuration = this.calculateTotalDuration(data);
                const completion = this.calculateCompletion(data);
                const container = document.getElementById('pdf-report-container');
                
                let html = `
                    <div style="font-family: 'Inter', Arial, sans-serif; color: #000; background: #fff; padding: 10px 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="font-size: 20pt; margin-bottom: 5px; color: #111; letter-spacing: 1px;">INFORME EJECUTIVO</h1>
                            <h2 style="font-size: 14pt; font-weight: normal; color: #555; text-transform: uppercase; margin: 0;">${p.name || 'Sin Título'}</h2>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 30px; text-align: center;">
                            <div style="padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; background: #f8fafc;">
                                <div style="font-size: 9pt; color: #64748b; text-transform: uppercase; margin-bottom: 5px; font-weight: 700;">Presupuesto Total</div>
                                <div style="font-size: 16pt; font-weight: 800; color: #0f172a;">${(p.total || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</div>
                            </div>
                            <div style="padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; background: #f8fafc;">
                                <div style="font-size: 9pt; color: #64748b; text-transform: uppercase; margin-bottom: 5px; font-weight: 700;">Duración Prevista</div>
                                <div style="font-size: 16pt; font-weight: 800; color: #0f172a;">${totalDuration} Días</div>
                            </div>
                            <div style="padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; background: #f8fafc;">
                                <div style="font-size: 9pt; color: #64748b; text-transform: uppercase; margin-bottom: 5px; font-weight: 700;">Tareas Completadas</div>
                                <div style="font-size: 16pt; font-weight: 800; color: #0f172a;">${completion}%</div>
                            </div>
                        </div>

                        <div style="margin-bottom: 30px;">
                            <h3 style="font-size: 12pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 15px; color: #334155; font-weight: 700;">Distribución por Capítulos</h3>
                            <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
                                <thead>
                                    <tr>
                                        <th style="text-align: left; padding: 6px 5px; width: 50px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Ord.</th>
                                        <th style="text-align: left; padding: 6px 5px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Capítulo</th>
                                        <th style="text-align: right; padding: 6px 5px; width: 120px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Importe</th>
                                        <th style="text-align: right; padding: 6px 5px; width: 80px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0;">%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.chapters.map(c => {
                                        const percentage = p.total > 0 ? (c.total / p.total) * 100 : 0;
                                        return `
                                        <tr>
                                            <td style="padding: 8px 5px; border-bottom: 1px solid #f1f5f9; color: #475569;">${c.order}</td>
                                            <td style="padding: 8px 5px; border-bottom: 1px solid #f1f5f9; font-weight: 500;">${c.title}</td>
                                            <td style="padding: 8px 5px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600;">${(c.total || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</td>
                                            <td style="padding: 8px 5px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #64748b;">${percentage.toFixed(1)}%</td>
                                        </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <h3 style="font-size: 12pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 15px; color: #334155; font-weight: 700;">Estado del Proyecto</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 10pt; background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                <div><span style="color: #64748b; font-weight: 600; display: inline-block; width: 150px;">Progreso de Obra:</span> <span style="font-weight: 700;">${p.progress || 0}%</span></div>
                                <div><span style="color: #64748b; font-weight: 600; display: inline-block; width: 120px;">Hito Actual:</span> <span style="font-weight: 500;">${p.milestone || 'Fase Inicial'}</span></div>
                                <div><span style="color: #64748b; font-weight: 600; display: inline-block; width: 150px;">Fecha Límite:</span> <span style="font-weight: 500;">${p.deadline || 'No definida'}</span></div>
                                <div><span style="color: #64748b; font-weight: 600; display: inline-block; width: 120px;">Nivel de Riesgo:</span> <span style="font-weight: 500;">${p.risk || 'Bajo'}</span></div>
                                <div style="grid-column: 1 / -1;"><span style="color: #64748b; font-weight: 600; display: inline-block; width: 150px;">Estado General:</span> <span style="font-weight: 700; color: ${p.status === 'Retraso' ? '#ef4444' : '#10b981'};">${p.status || 'En plazo'}</span></div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 30px; text-align: center; font-size: 8pt; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px;">
                            Generado automáticamente por MusaMediciones el ${new Date().toLocaleDateString('es-ES')}
                        </div>
                    </div>
                `;
                
                container.innerHTML = html;
                container.style.display = 'block';
                
                setTimeout(() => {
                    const originalTitle = document.title;
                    document.title = "Informe Ejecutivo - " + (p.name || "Proyecto");

                    const afterPrintHandler = () => {
                        document.title = originalTitle;
                        container.style.display = 'none';
                        container.innerHTML = '';
                        window.removeEventListener('afterprint', afterPrintHandler);
                    };
                    window.addEventListener('afterprint', afterPrintHandler);
                    
                    window.print();
                }, 300);
            });
        }

        const inpProgress = this.container.querySelector('#inp-progress');
        if (inpProgress) inpProgress.addEventListener('change', (e) => window.state.updateProjectMetadata('progress', parseFloat(e.target.value) || 0));

        const inpMilestone = this.container.querySelector('#inp-milestone');
        if (inpMilestone) inpMilestone.addEventListener('change', (e) => window.state.updateProjectMetadata('milestone', e.target.value));

        const inpDeadline = this.container.querySelector('#inp-deadline');
        if (inpDeadline) inpDeadline.addEventListener('change', (e) => window.state.updateProjectMetadata('deadline', e.target.value));

        const selRisk = this.container.querySelector('#sel-risk');
        if (selRisk) selRisk.addEventListener('change', (e) => window.state.updateProjectMetadata('risk', e.target.value));

        const selStatus = this.container.querySelector('#sel-status');
        if (selStatus) selStatus.addEventListener('change', (e) => window.state.updateProjectMetadata('status', e.target.value));
    }

    calculateTotalDuration(data) {
        let maxDays = 0;
        const projectStart = new Date(data.project.startDate || new Date());
        data.chapters.forEach(c => {
            c.items.forEach(i => {
                if (i.planning && i.planning.endDate) {
                    const end = new Date(i.planning.endDate);
                    const diffDays = Math.ceil((end - projectStart) / (1000 * 60 * 60 * 24));
                    if (diffDays > maxDays) maxDays = diffDays;
                }
            });
        });
        return maxDays || 0;
    }

    calculateCompletion(data) {
        let totalItems = 0;
        let completedItems = 0;
        data.chapters.forEach(c => {
            c.items.forEach(i => {
                totalItems++;
                if (i.qty > 0) completedItems++;
            });
        });
        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    }

    renderChapterBar(chapter, total) {
        const percentage = total > 0 ? (chapter.total / total) * 100 : 0;
        return `
            <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 1rem; font-weight: 600;">
                    <span style="color: var(--text-secondary);">${chapter.title}</span>
                    <span style="color: var(--text-primary);">${chapter.total.toLocaleString('es-ES')}€ (${percentage.toFixed(1)}%)</span>
                </div>
                <div style="height: 12px; background: #f1f5f9; border-radius: 6px; overflow: hidden; border: 1px solid var(--border);">
                    <div style="width: ${percentage}%; height: 100%; background: var(--primary); transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);"></div>
                </div>
            </div>
        `;
    }
}

window.DashboardView = DashboardView;
