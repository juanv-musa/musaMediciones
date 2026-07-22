/**
 * MusaMediciones Global Portfolio Dashboard
 */

class PortfolioView {
    constructor(container) {
        this.container = container;
        
        // Datos quemados provistos por el usuario para la demostración
        this.mockProjects = [
            { name: "38. CM JODAR 2026", deadline: "31 JULIO", progress: 85, milestone: "Hito 4/4", status: "Cierre", statusColor: "var(--warning)" },
            { name: "CI 40. SANTA ELENA IBERA 2026", deadline: "14 SEPTIEMBRE", progress: 60, milestone: "Hito 2/3", status: "En plazo", statusColor: "var(--primary)" },
            { name: "PM_11. PLAN SEGURIDAD ALCALA LA REAL", deadline: "28 SEPTIEMBRE", progress: 35, milestone: "Hito 1/4", status: "En plazo", statusColor: "var(--primary)" },
            { name: "ME_08 PANELES MUELA, MENGÍBAR 2022", deadline: "28 SEPTIEMBRE", progress: 100, milestone: "Entregado", status: "Finalizado", statusColor: "#10b981" },
            { name: "MI_18. ALMENA 14 MUNITUR 25 BAÑOS ENCINA", deadline: "6 OCTUBRE", progress: 20, milestone: "Hito 1/5", status: "Retraso", statusColor: "var(--danger)" },
            { name: "ME_14 PIEDRA SECA BAÑOS ENCINA", deadline: "6 OCTUBRE", progress: 25, milestone: "Hito 1/2", status: "En plazo", statusColor: "var(--primary)" },
            { name: "41. CI EL PAJARILLO 2026", deadline: "30 NOVIEMBRE", progress: 5, milestone: "Fase Inicial", status: "En plazo", statusColor: "var(--primary)" }
        ];
    }

    render(data) {
        let projectsHtml = this.mockProjects.map(p => `
            <div style="display: grid; grid-template-columns: 3fr 2fr 2fr 1fr; align-items: center; padding: 1.2rem 1rem; border-bottom: 1px solid var(--border); transition: all 0.2s; border-radius: 8px;" onmouseover="this.style.background='white'" onmouseout="this.style.background='transparent'">
                <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">${p.name}</div>
                <div style="color: var(--text-secondary); font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="calendar" style="width:14px;"></i> ${p.deadline}
                </div>
                <div style="padding-right: 2rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.4rem;">
                        <span style="font-weight: 600;">${p.progress}% Completado</span>
                        <span style="color: var(--text-secondary)">${p.milestone}</span>
                    </div>
                    <div style="height: 6px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${p.progress}%; height: 100%; background: ${p.statusColor}; border-radius: 4px;"></div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <span style="padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 600; color: ${p.statusColor}; border: 1px solid ${p.statusColor}40; background: ${p.statusColor}15;">${p.status}</span>
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
                        <div style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary);">7</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">En ejecución actual</div>
                    </div>
                    <!-- KPI 2 -->
                    <div class="glass" style="padding: 1.5rem; border-radius: var(--radius-lg); background: white;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.8rem;">
                            <i data-lucide="check-circle-2" style="width:18px; color: var(--primary)"></i> Progreso Global
                        </div>
                        <div style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary);">48%</div>
                        <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-top: 0.3rem;">Ritmo adecuado</div>
                    </div>
                    <!-- KPI 3 -->
                    <div class="glass" style="padding: 1.5rem; border-radius: var(--radius-lg); background: white; border-bottom: 4px solid var(--danger);">
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.8rem;">
                            <i data-lucide="alert-triangle" style="width:18px; color: var(--danger)"></i> Tareas Críticas
                        </div>
                        <div style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary);">3</div>
                        <div style="font-size: 0.8rem; color: var(--danger); font-weight: 600; margin-top: 0.3rem;">Retrasos detectados</div>
                    </div>
                    <!-- KPI 4 -->
                    <div class="glass" style="padding: 1.5rem; border-radius: var(--radius-lg); background: white;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.8rem;">
                            <i data-lucide="wallet" style="width:18px; color: #8b5cf6"></i> Desviación Presup.
                        </div>
                        <div style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary);">-1.2%</div>
                        <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-top: 0.3rem;">Dentro de márgenes</div>
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
                            ${projectsHtml}
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
                                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--danger);">1</div>
                                    <div style="font-size: 0.7rem; color: #7f1d1d; margin-top: 0.4rem;">MI_18 Almena</div>
                                </div>
                                <div style="padding: 1.2rem; border-radius: 12px; background: #fffbeb; border: 1px solid #fde68a; text-align: center;">
                                    <div style="font-size: 0.85rem; color: var(--warning); font-weight: 600; margin-bottom: 0.5rem;">Riesgo Medio</div>
                                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--warning);">1</div>
                                    <div style="font-size: 0.7rem; color: #92400e; margin-top: 0.4rem;">CM Jódar</div>
                                </div>
                                <div style="padding: 1.2rem; border-radius: 12px; background: #eff6ff; border: 1px solid #bfdbfe; text-align: center;">
                                    <div style="font-size: 0.85rem; color: #3b82f6; font-weight: 600; margin-bottom: 0.5rem;">Riesgo Bajo</div>
                                    <div style="font-size: 1.8rem; font-weight: 800; color: #3b82f6;">4</div>
                                    <div style="font-size: 0.7rem; color: #1e3a8a; margin-top: 0.4rem;">Desarrollo Normal</div>
                                </div>
                                <div style="padding: 1.2rem; border-radius: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; text-align: center;">
                                    <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">Finalizados</div>
                                    <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">1</div>
                                    <div style="font-size: 0.7rem; color: #14532d; margin-top: 0.4rem;">Sin riesgo</div>
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
                                <span style="color: var(--text-secondary);">Presupuesto Total (Activos)</span>
                                <span style="font-weight: 700;">345.000 €</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.95rem;">
                                <span style="color: var(--text-secondary);">Gasto Real Acumulado</span>
                                <span style="font-weight: 700; color: var(--text-primary);">158.400 €</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.95rem;">
                                <span style="color: var(--text-secondary);">Ratio de Consumo</span>
                                <span style="font-weight: 700; color: var(--primary);">45.9%</span>
                            </div>
                            
                            <div style="margin-top: 2rem;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.6rem; font-weight: 600;">
                                    <span>Consumo de Presupuesto Global</span>
                                    <span>45%</span>
                                </div>
                                <div style="height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; border: 1px solid var(--border);">
                                    <div style="width: 45%; height: 100%; background: linear-gradient(90deg, var(--primary), #10b981); border-radius: 5px;"></div>
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
