/**
 * MusaMediciones Budget Component
 * High-Fidelity Presto/Gropit distribution
 * Includes Overheads (GG & BI)
 */

class BudgetView {
    constructor(container) {
        this.container = container;
    }

    render(data) {
        if (!data || !data.project) {
            this.container.innerHTML = '<div class="glass" style="padding: 2rem; text-align: center;">Cargando presupuesto...</div>';
            return;
        }
        const p = data.project;
        this.container.innerHTML = `
            <div class="budget-view" style="animation: fadeIn 0.4s ease-out;">
                <!-- Project Metadata Header (Screen Only) -->
                <div id="project-meta-editor" class="glass ignore-print" style="padding: 2.5rem; border-radius: var(--radius-xl); background: white; margin-bottom: 2rem;">
                    <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--primary); margin-bottom: 1.5rem; text-transform: uppercase;">Configuración del Informe</h3>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;">
                        <div class="meta-field">
                            <label>SITUACIÓN</label>
                            <input type="text" data-meta="situation" value="${p.situation || ''}" placeholder="Calle, Nº, Ciudad...">
                        </div>
                        <div class="meta-field">
                            <label>PROPIEDAD</label>
                            <input type="text" data-meta="property" value="${p.property || ''}" placeholder="Ayuntamiento, Particular...">
                        </div>
                        <div class="meta-field">
                            <label>PROFESIONAL (AUTOR)</label>
                            <input type="text" data-meta="author" value="${p.author || ''}" placeholder="Nombre del profesional">
                        </div>
                        <div class="meta-field">
                            <label>TITULACIÓN</label>
                            <input type="text" data-meta="authorTitle" value="${p.authorTitle || ''}" placeholder="MUSEOLOGO, ARQUITECTO...">
                        </div>
                        <div class="meta-field">
                            <label>LOCALIDAD (FIRMA)</label>
                            <input type="text" data-meta="location" value="${p.location || ''}" placeholder="La Carolina, Jódar...">
                        </div>
                        <div class="meta-field">
                            <label>G.G. (%) <span style="font-size: 0.6rem; color: var(--primary);">(13% / 19% Patr.)</span></label>
                            <select data-meta="expensesPct" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--border); background: #f8fafc;">
                                <option value="13" ${p.expensesPct === 13 ? 'selected' : ''}>13% (General)</option>
                                <option value="19" ${p.expensesPct === 19 ? 'selected' : ''}>19% (Patrimonio)</option>
                                <option value="0" ${p.expensesPct === 0 ? 'selected' : ''}>0% (Sin G.G.)</option>
                            </select>
                        </div>
                        <div class="meta-field">
                            <label>B.I. (%)</label>
                            <input type="number" data-meta="benefitPct" value="${p.benefitPct || 0}">
                        </div>
                        <div class="meta-field">
                            <label>I.V.A (%)</label>
                            <input type="number" data-meta="taxPct" value="${p.taxPct || 0}">
                        </div>
                    </div>
                </div>

                <!-- Main Budget & Measurements -->
                <div class="budget-tree-container glass" style="padding: 2.5rem; border-radius: var(--radius-xl); background: white;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem;" class="ignore-print">
                        <h2 style="font-weight: 800; font-size: 1.8rem;">Detalle de Presupuesto</h2>
                        <button id="btn-add-chapter" class="btn-musa">+ Nuevo Capítulo</button>
                    </div>

                    <div id="budget-tree-root">
                        ${this.renderTree(data.chapters)}
                    </div>

                    <!-- Enhanced Totals Block -->
                    <div style="margin-top: 40px; padding: 20px; border-top: 2px solid #000; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                        <div style="font-size: 0.9rem; color: #666;">SUMA EJECUCIÓN MATERIAL: <strong>${p.pem.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</strong></div>
                        <div style="font-size: 0.9rem; color: #7c3aed; font-weight: 700;">GASTO REAL TOTAL: <strong>${(p.actualSpend || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</strong></div>
                        <div style="font-size: 0.9rem; color: #666;">GASTOS GENERALES (${p.expensesPct}%): <strong>${p.expensesTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</strong></div>
                        <div style="font-size: 0.9rem; color: #666;">BENEFICIO INDUSTRIAL (${p.benefitPct}%): <strong>${p.benefitTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</strong></div>
                        <div style="font-size: 0.9rem; color: #666; margin-top: 4px; padding-top: 4px; border-top: 1px dashed #ccc;">SUMA (P.E.C.): <strong>${p.pec.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</strong></div>
                        <div style="font-size: 0.9rem; color: #666;">I.V.A. (${p.taxPct}%): <strong>${p.taxTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</strong></div>
                        <div style="font-size: 1.2rem; font-weight: 800; margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
                            TOTAL PRESUPUESTO: <span style="color: var(--primary);">${p.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.addEventListeners();
        if (window.lucide) lucide.createIcons();
    }

    renderTree(chapters) {
        return chapters.map(chapter => `
            <div class="chapter" data-id="${chapter.id}" style="margin-bottom: 30px; page-break-inside: avoid;">
                <div class="chapter-header" style="background: #f1f5f9; padding: 12px 15px; border: 1.5px solid #000; display: flex; align-items: center; justify-content: space-between; font-weight: 800; text-transform: uppercase;">
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <span>${chapter.order}</span>
                        <div contenteditable="true" class="chapter-title-edit" data-id="${chapter.id}" style="border-bottom: 1px dashed transparent; outline: none;">${chapter.title}</div>
                    </div>
                    <div class="chapter-actions ignore-print" style="display: flex; gap: 10px; opacity: 0.5;">
                        <span class="btn-move-chapter-up" data-id="${chapter.id}" style="cursor: pointer;"><i data-lucide="arrow-up" style="width: 14px;"></i></span>
                        <span class="btn-move-chapter-down" data-id="${chapter.id}" style="cursor: pointer;"><i data-lucide="arrow-down" style="width: 14px;"></i></span>
                        <span class="btn-rename-chapter" data-id="${chapter.id}" style="cursor: pointer;"><i data-lucide="edit-3" style="width: 14px;"></i></span>
                        <span class="btn-delete-chapter" data-id="${chapter.id}" style="cursor: pointer; color: #ef4444;"><i data-lucide="trash-2" style="width: 14px;"></i></span>
                    </div>
                </div>
                
                <div class="table-header technical-header" style="display: grid; grid-template-columns: 60px 1fr 60px 60px 60px 60px 80px 80px 100px 100px; gap: 10px; padding: 10px 15px; font-size: 0.7rem; font-weight: 800; border-bottom: 2px solid #000; text-transform: uppercase;">
                    <div>Ord</div>
                    <div>Descripción</div>
                    <div style="text-align: right;">Uds</div>
                    <div style="text-align: right;">Largo</div>
                    <div style="text-align: right;">Ancho</div>
                    <div style="text-align: right;">Alto</div>
                    <div style="text-align: right;">Subtotal</div>
                    <div style="text-align: right;">Precio</div>
                    <div style="text-align: right;">Importe</div>
                    <div style="text-align: right; color: #8b5cf6;">Gasto Real</div>
                </div>

                ${chapter.items.map(item => this.renderItem(item)).join('')}
                
                <div style="padding: 10px 0; border-top: 1px solid #000; display: flex; justify-content: flex-end; align-items: center; gap: 2rem;" class="ignore-print">
                    <button class="add-item-btn btn-musa-ghost" data-chapter-id="${chapter.id}" style="font-size: 0.8rem; font-weight: 700;">+ Añadir Partida</button>
                    <div style="flex: 1;"></div>
                    <div style="font-size: 0.75rem; color: #8b5cf6; font-weight: 700;">GASTO REAL CAPÍTULO: <span style="margin-left: 8px;">${(chapter.actualSpend || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></div>
                    <div style="font-weight: 800; text-transform: uppercase; font-size: 0.9rem;">TOTAL CAPÍTULO ${chapter.order} <span style="margin-left: 20px;">${chapter.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span></div>
                </div>
            </div>
        `).join('');
    }

    renderItem(item) {
        return `
            <div class="item-block" style="border-bottom: 1px solid #eee;">
                <!-- Main Item Row -->
                <div class="partida" style="display: grid; grid-template-columns: 60px 1fr 60px 60px 60px 60px 80px 80px 100px 100px; gap: 10px; padding: 12px 15px; align-items: start; background: white;">
                    <div style="font-family: 'JetBrains Mono'; font-weight: 700; font-size: 0.8rem;">${item.order}</div>
                    <div style="font-size: 0.85rem;">
                        <div contenteditable="true" class="item-title-edit" data-id="${item.id}" style="font-weight: 800; text-transform: uppercase; margin-bottom: 4px; outline: none; border-bottom: 1px dashed #ddd;">${item.descShort}</div>
                        <div contenteditable="true" class="item-desc-edit" data-id="${item.id}" style="font-size: 0.75rem; color: #666; line-height: 1.4; outline: none; min-height: 1em;">${item.descLong || ''}</div>
                    </div>
                    <div style="text-align: right; font-size: 0.85rem; font-weight: 600;">
                        <select class="unit-select ignore-print" data-id="${item.id}" style="padding: 2px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.75rem;">
                            <option value="ud" ${item.unit === 'ud' ? 'selected' : ''}>ud</option>
                            <option value="m2" ${item.unit === 'm2' ? 'selected' : ''}>m2</option>
                            <option value="m3" ${item.unit === 'm3' ? 'selected' : ''}>m3</option>
                            <option value="ml" ${item.unit === 'ml' ? 'selected' : ''}>ml</option>
                        </select>
                        <span class="print-only">${item.unit}</span>
                    </div>
                    <div></div><div></div><div></div><div></div>
                    <div class="val" style="text-align: right;">
                        <input type="number" class="price-input technical-input ignore-print" data-id="${item.id}" value="${item.price.toFixed(2)}">
                        <span class="print-only">${item.price.toFixed(2)}</span>
                    </div>
                    <div style="text-align: right; font-weight: 800; font-size: 0.9rem;">${item.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
                    <div style="text-align: right;">
                        <input type="number" class="actual-spend-input ignore-print" data-id="${item.id}" min="0" value="${(item.actualSpend || 0).toFixed(2)}" style="width: 90px; padding: 3px 5px; border: 1px solid #c4b5fd; border-radius: 4px; font-size: 0.8rem; text-align: right; background: #f5f3ff; color: #7c3aed;"
                            title="Gasto real acumulado en esta partida">
                        <span class="print-only" style="color: #7c3aed;">${(item.actualSpend || 0).toFixed(2)}</span>
                    </div>
                </div>

                <!-- Measurement Rows -->
                ${item.measurements.map(m => `
                    <div class="measurement-row" style="display: grid; grid-template-columns: 60px 1fr 60px 60px 60px 60px 80px 80px 100px 100px; gap: 10px; padding: 4px 15px; font-size: 0.8rem; color: #444; background: #fdfdfd;">
                        <div></div>
                        <div style="padding-left: 20px; font-style: italic;">
                            <input type="text" class="m-desc-edit ignore-print" data-id="${item.id}" data-mid="${m.id}" value="${m.desc || ''}" placeholder="Línea medición..." style="background: transparent; border: none; border-bottom: 1px dashed #ddd; font-size: 0.75rem; width: 100%; outline: none; color: #666;">
                            <span class="print-only">${m.desc || 'Línea medición'}</span>
                        </div>
                        <div class="val-edit"><input type="number" class="m-edit" data-id="${item.id}" data-mid="${m.id}" data-field="units" value="${m.units}"></div>
                        <div class="val-edit"><input type="number" class="m-edit" data-id="${item.id}" data-mid="${m.id}" data-field="length" value="${m.length}"></div>
                        <div class="val-edit"><input type="number" class="m-edit" data-id="${item.id}" data-mid="${m.id}" data-field="width" value="${m.width}"></div>
                        <div class="val-edit"><input type="number" class="m-edit" data-id="${item.id}" data-mid="${m.id}" data-field="height" value="${m.height}"></div>
                        <div style="text-align: right;">${m.subtotal.toFixed(2)}</div>
                        <div></div><div></div><div></div>
                    </div>
                `).join('')}

                <div class="ignore-print" style="padding: 5px 15px 15px 95px;">
                    <button class="btn-move-item-up" data-id="${item.id}" style="font-size: 0.7rem; color: #64748b; background: none; border: none; cursor: pointer;"><i data-lucide="arrow-up" style="width: 14px;"></i></button>
                    <button class="btn-move-item-down" data-id="${item.id}" style="font-size: 0.7rem; color: #64748b; background: none; border: none; cursor: pointer;"><i data-lucide="arrow-down" style="width: 14px;"></i></button>
                    <button class="add-m-btn" data-id="${item.id}" style="font-size: 0.7rem; color: var(--primary); background: none; border: 1px dashed var(--primary); padding: 2px 10px; border-radius: 4px; cursor: pointer;">+ Añadir medición</button>
                    <button class="btn-toggle-planning" data-id="${item.id}" style="font-size: 0.7rem; color: #f59e0b; background: none; border: 1px dashed #f59e0b; padding: 2px 10px; border-radius: 4px; cursor: pointer; margin-left: 10px;"><i data-lucide="calendar" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>Planificación</button>
                    <button class="btn-delete-item" data-id="${item.id}" style="font-size: 0.7rem; color: #ef4444; background: none; border: none; margin-left: 10px; cursor: pointer;">Eliminar partida</button>
                </div>
                
                <!-- Planning Drawer -->
                <div class="planning-drawer ignore-print" id="planning-drawer-${item.id}" style="display: none; background: #fffbeb; padding: 15px; border-top: 1px dashed #fde68a; font-size: 0.8rem;">
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <div>
                            <label style="display: block; font-size: 0.7rem; color: #b45309; font-weight: 700; margin-bottom: 4px;">Fecha Inicio</label>
                            <input type="date" class="plan-start-date" data-id="${item.id}" value="${item.planning?.startDate || ''}" style="padding: 4px; border: 1px solid #fcd34d; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.7rem; color: #b45309; font-weight: 700; margin-bottom: 4px;">Duración (días)</label>
                            <input type="number" class="plan-duration" data-id="${item.id}" value="${item.planning?.duration || 0}" min="0" style="padding: 4px; width: 60px; border: 1px solid #fcd34d; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.7rem; color: #b45309; font-weight: 700; margin-bottom: 4px;">Progreso (%)</label>
                            <input type="number" class="plan-progress" data-id="${item.id}" value="${item.planning?.progress || 0}" min="0" max="100" style="padding: 4px; width: 60px; border: 1px solid #fcd34d; border-radius: 4px;">
                        </div>
                        <div style="flex: 1; text-align: right; color: #d97706; font-size: 0.75rem;">
                            <em>Calculado automáticamente en el diagrama de Gantt.</em>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        this.container.querySelectorAll('[data-meta]').forEach(el => {
            el.addEventListener('change', (e) => {
                window.state.updateProjectMetadata(el.getAttribute('data-meta'), e.target.value);
            });
        });

        this.container.querySelectorAll('.price-input').forEach(el => {
            el.addEventListener('change', (e) => {
                window.state.updateItemData(el.getAttribute('data-id'), 'price', e.target.value);
            });
        });

        this.container.querySelectorAll('.actual-spend-input').forEach(el => {
            el.addEventListener('change', (e) => {
                window.state.updateItemData(el.getAttribute('data-id'), 'actualSpend', parseFloat(e.target.value) || 0);
            });
        });

        this.container.querySelectorAll('.m-edit').forEach(el => {
            el.addEventListener('change', (e) => {
                window.state.updateMeasurement(el.getAttribute('data-id'), el.getAttribute('data-mid'), el.getAttribute('data-field'), e.target.value);
            });
        });

        // Chapter title edit
        this.container.querySelectorAll('.chapter-title-edit').forEach(el => {
            el.addEventListener('blur', (e) => {
                window.state.renameChapter(el.getAttribute('data-id'), e.target.textContent);
            });
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
            });
        });

        // Item title/desc edit
        this.container.querySelectorAll('.item-title-edit').forEach(el => {
            el.addEventListener('blur', (e) => {
                window.state.updateItemData(el.getAttribute('data-id'), 'descShort', e.target.textContent);
            });
        });
        this.container.querySelectorAll('.item-desc-edit').forEach(el => {
            el.addEventListener('blur', (e) => {
                window.state.updateItemData(el.getAttribute('data-id'), 'descLong', e.target.textContent);
            });
        });

        // Unit select
        this.container.querySelectorAll('.unit-select').forEach(el => {
            el.addEventListener('change', (e) => {
                window.state.updateItemData(el.getAttribute('data-id'), 'unit', e.target.value);
            });
        });

        // Measurement desc edit
        this.container.querySelectorAll('.m-desc-edit').forEach(el => {
            el.addEventListener('change', (e) => {
                window.state.updateMeasurement(el.getAttribute('data-id'), el.getAttribute('data-mid'), 'desc', e.target.value);
            });
        });

        const addChapterBtn = this.container.querySelector('#btn-add-chapter');
        if (addChapterBtn) addChapterBtn.addEventListener('click', () => {
            const title = prompt('Nombre Capítulo:', 'Capítulo');
            if (title) window.state.addChapter(title);
        });

        this.container.querySelectorAll('.add-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.state.addItem(btn.getAttribute('data-chapter-id'));
            });
        });

        this.container.querySelectorAll('.add-m-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = window.state.data.chapters.flatMap(c => c.items).find(i => i.id === btn.getAttribute('data-id'));
                if (item) {
                    item.measurements.push({ id: 'M' + Date.now(), units: 1, length: 1, width: 1, height: 1, subtotal: 1 });
                    window.state.calculate();
                }
            });
        });

        // Planning drawer toggles
        this.container.querySelectorAll('.btn-toggle-planning').forEach(btn => {
            btn.addEventListener('click', () => {
                const drawer = this.container.querySelector(`#planning-drawer-${btn.getAttribute('data-id')}`);
                if (drawer) {
                    drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
                }
            });
        });

        // Planning fields updates
        this.container.querySelectorAll('.plan-start-date').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                window.state.updateItemPlanning(id, { startDate: e.target.value });
            });
        });
        this.container.querySelectorAll('.plan-duration').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                window.state.updateItemPlanning(id, { duration: parseInt(e.target.value) || 0 });
            });
        });
        this.container.querySelectorAll('.plan-progress').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                window.state.updateItemPlanning(id, { progress: parseInt(e.target.value) || 0 });
            });
        });

        this.container.querySelectorAll('.btn-rename-chapter').forEach(btn => {
            btn.addEventListener('click', () => {
                const title = prompt('Nuevo nombre:');
                if (title) window.state.renameChapter(btn.getAttribute('data-id'), title);
            });
        });

        this.container.querySelectorAll('.btn-delete-chapter').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('¿Eliminar capítulo?')) window.state.deleteChapter(btn.getAttribute('data-id'));
            });
        });
        
        this.container.querySelectorAll('.btn-delete-item').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('¿Eliminar partida?')) {
                   const itemId = btn.getAttribute('data-id');
                   window.state.data.chapters.forEach(c => {
                       c.items = c.items.filter(i => i.id !== itemId);
                   });
                   window.state.calculate();
                }
            });
        });

        this.container.querySelectorAll('.btn-move-chapter-up').forEach(btn => {
            btn.addEventListener('click', () => window.state.moveChapter(btn.getAttribute('data-id'), -1));
        });

        this.container.querySelectorAll('.btn-move-chapter-down').forEach(btn => {
            btn.addEventListener('click', () => window.state.moveChapter(btn.getAttribute('data-id'), 1));
        });

        this.container.querySelectorAll('.btn-move-item-up').forEach(btn => {
            btn.addEventListener('click', () => window.state.moveItem(btn.getAttribute('data-id'), -1));
        });

        this.container.querySelectorAll('.btn-move-item-down').forEach(btn => {
            btn.addEventListener('click', () => window.state.moveItem(btn.getAttribute('data-id'), 1));
        });
    }
}

window.BudgetView = BudgetView;
