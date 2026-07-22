/**
 * MusaMediciones Global Portfolio Dashboard
 */

class PortfolioView {
    constructor(container) {
        this.container = container;
    }

    render(data, projects = [], clients = []) {
        if (!projects) projects = [];

        // Calculate KPIs
        const activeProjects = projects.length;
        let totalProgress = 0;
        let criticalTasks = 0;
        let totalBudget = 0;
        let totalActualSpend = 0;

        let riskHigh = 0;
        let riskMed = 0;
        let riskLow = 0;
        let completedCount = 0;

        projects.forEach(p => {
            totalProgress += (p.progress || 0);
            totalBudget += (p.total || 0);
            totalActualSpend += (p.actualSpend || 0);
            
            if (p.risk === 'Alto') riskHigh++;
            else if (p.risk === 'Medio') riskMed++;
            else if (p.risk === 'Bajo') riskLow++;

            if (p.status === 'Retraso') criticalTasks++;
            if (p.status === 'Finalizado') completedCount++;
        });

        const avgProgress = activeProjects > 0 ? Math.round(totalProgress / activeProjects) : 0;

        const getStatusColor = (status) => {
            if (status === 'Cierre') return 'var(--warning)';
            if (status === 'Retraso') return 'var(--danger)';
            if (status === 'Finalizado') return '#10b981';
            return 'var(--primary)'; // En plazo
        };

        let projectsHtml = projects.map(p => `
            <div style="display: grid; grid-template-columns: 3fr 2fr 2fr 1fr; align-items: center; padding: 1.2rem 1rem; border-bottom: 1px solid var(--border); transition: all 0.2s; border-radius: 8px;" onmouseover="this.style.background='white'" onmouseout="this.style.background='transparent'">
                <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">${p.name}</div>
                <div style="color: var(--text-secondary); font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="calendar" style="width:14px;"></i> ${p.deadline || 'Sin fecha'}
                </div>
                <div style="padding-right: 2rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.4rem;">
                        <span style="font-weight: 600;">${p.progress || 0}% Completado</span>
                        <span style="color: var(--text-secondary)">${p.milestone || ''}</span>
                    </div>
                    <div style="height: 6px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${p.progress || 0}%; height: 100%; background: ${getStatusColor(p.status)}; border-radius: 4px;"></div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <span style="padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 600; color: ${getStatusColor(p.status)}; border: 1px solid ${getStatusColor(p.status)}40; background: ${getStatusColor(p.status)}15;">${p.status || 'En plazo'}</span>
                </div>
            </div>
        `).join('');

        this.container.innerHTML = `
            <div class="portfolio-view view-container" style="animation: fadeIn 0.4s ease-out; padding-bottom: 3rem;">
                <h2 style="margin-bottom: 0.5rem; font-weight: 800; font-size: 2.2rem; color: var(--text-primary);">Dashboard Global de Proyectos</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Resumen de portfolio, estado de ejecución y alertas tempranas.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
                    <!-- KPI 1 -->
                    <div class="glass" style="padding: 1.5rem; border-radius: var(--radius-lg); background: white;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.8rem;">
                            <i data-lucide="folder-kanban" style="width:18px; color: var(--primary)"></i> Proyectos Activos
                        </div>
                        <div style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary);">${activeProjects}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">En ejecución actual</div>
                    </div>
                    <!-- KPI 2 -->
                    <div class="glass" style="padding: 1.5rem; border-radius: var(--radius-lg); background: white;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.8rem;">
                            <i data-lucide="check-circle-2" style="width:18px; color: var(--primary)"></i> Progreso Medio
                        </div>
                        <div style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary);">${avgProgress}%</div>
                        <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-top: 0.3rem;">Ritmo global</div>
                    </div>
                    <!-- KPI 3 -->
                    <div class="glass" style="padding: 1.5rem; border-radius: var(--radius-lg); background: white; border-bottom: 4px solid var(--danger);">
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.8rem;">
                            <i data-lucide="alert-triangle" style="width:18px; color: var(--danger)"></i> Tareas Críticas
                        </div>
                        <div style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary);">${criticalTasks}</div>
                        <div style="font-size: 0.8rem; color: var(--danger); font-weight: 600; margin-top: 0.3rem;">Retrasos detectados</div>
                    </div>
                    <!-- KPI 4 -->
                    <div class="glass" style="padding: 1.5rem; border-radius: var(--radius-lg); background: white;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.8rem;">
                            <i data-lucide="wallet" style="width:18px; color: #8b5cf6"></i> Presup. Total
                        </div>
                        <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary);">${totalBudget.toLocaleString('es-ES', { minimumFractionDigits: 0 })}€</div>
                        <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-top: 0.3rem;">Volumen gestionado</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                    <!-- Projects List -->
                    <div class="glass" style="padding: 2rem; border-radius: var(--radius-xl); background: white;">
                        <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem;">
                            <i data-lucide="list-todo" style="color: var(--primary);"></i>
                            <h3 style="font-size: 1.3rem; font-weight: 700;">Estado de Proyectos</h3>
                        </div>
                        
                        <div style="display: flex; flex-direction: column;">
                            ${projectsHtml || '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">Aún no has guardado ningún proyecto.</div>'}
                        </div>
                    </div>
                    
                    <!-- Side Panels -->
                    <div style="display: flex; flex-direction: column; gap: 2rem;">
                        <!-- Risk Matrix -->
                        <div class="glass" style="padding: 2rem; border-radius: var(--radius-xl); background: white;">
                            <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem;">
                                <i data-lucide="shield-alert" style="color: var(--warning);"></i>
                                <h3 style="font-size: 1.3rem; font-weight: 700;">Matriz de Riesgos</h3>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div style="padding: 1.2rem; border-radius: 12px; background: #fef2f2; border: 1px solid #fecaca; text-align: center;">
                                    <div style="font-size: 0.85rem; color: var(--danger); font-weight: 600; margin-bottom: 0.5rem;">Riesgo Alto</div>
                                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--danger);">${riskHigh}</div>
                                </div>
                                <div style="padding: 1.2rem; border-radius: 12px; background: #fffbeb; border: 1px solid #fde68a; text-align: center;">
                                    <div style="font-size: 0.85rem; color: var(--warning); font-weight: 600; margin-bottom: 0.5rem;">Riesgo Medio</div>
                                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--warning);">${riskMed}</div>
                                </div>
                                <div style="padding: 1.2rem; border-radius: 12px; background: #eff6ff; border: 1px solid #bfdbfe; text-align: center;">
                                    <div style="font-size: 0.85rem; color: #3b82f6; font-weight: 600; margin-bottom: 0.5rem;">Riesgo Bajo</div>
                                    <div style="font-size: 1.8rem; font-weight: 800; color: #3b82f6;">${riskLow}</div>
                                </div>
                                <div style="padding: 1.2rem; border-radius: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; text-align: center;">
                                    <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">Finalizados</div>
                                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">${completedCount}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Financials -->
                        <div class="glass" style="padding: 2rem; border-radius: var(--radius-xl); background: white;">
                            <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.5rem;">
                                <i data-lucide="pie-chart" style="color: var(--primary);"></i>
                                <h3 style="font-size: 1.3rem; font-weight: 700;">Salud Financiera</h3>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.95rem;">
                                <span style="color: var(--text-secondary);">Presupuesto Total Estimado</span>
                                <span style="font-weight: 700;">${totalBudget.toLocaleString('es-ES', { minimumFractionDigits: 0 })} €</span>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.95rem;">
                                <span style="color: var(--text-secondary);">Gasto Real Acumulado</span>
                                <span style="font-weight: 700; color: var(--primary);">${totalActualSpend.toLocaleString('es-ES', { minimumFractionDigits: 0 })} €</span>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.95rem;">
                                <span style="color: var(--text-secondary);">Ratio de Consumo</span>
                                <span style="font-weight: 700; color: ${(totalBudget > 0 && (totalActualSpend / totalBudget) > 1) ? 'var(--danger)' : 'var(--text-primary)'};">${totalBudget > 0 ? ((totalActualSpend / totalBudget) * 100).toFixed(1) : 0}%</span>
                            </div>
                            
                            <div style="margin-top: 2rem;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.6rem; font-weight: 600;">
                                    <span>Avance Medio Ponderado</span>
                                    <span>${avgProgress}%</span>
                                </div>
                                <div style="height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; border: 1px solid var(--border);">
                                    <div style="width: ${avgProgress}%; height: 100%; background: linear-gradient(90deg, var(--primary), #10b981); border-radius: 5px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (window.lucide) lucide.createIcons();
    }
}

window.PortfolioView = PortfolioView;
