/**
 * MusaMediciones State Management
 * Cloud Version (Firebase Firestore)
 */

class State {
    constructor() {
        this.listeners = [];
        this.app = null;
        this.db = null;
        this.auth = null;
        this.data = null;
        this.projects = [];
        this.clients = [];
    }

    initFirebaseAppOnly() {
        if (!window.firebase) return false;
        try {
            if (!this.app) {
                this.app = window.firebase.initializeApp(window.FIREBASE_CONFIG);
                this.auth = window.firebase.getAuth(this.app);
            }
            return true;
        } catch (error) {
            console.error("MusaState: Firebase App Init Error:", error);
            return false;
        }
    }

    async initFirebase() {
        console.log("MusaState: Invocando initFirebase...");
        if (!this.app) {
            if (!this.initFirebaseAppOnly()) return;
        }

        if (!this.auth.currentUser) {
            console.warn("MusaState: Usuario no autenticado en initFirebase. Lecturas detenidas.");
            return;
        }

        if (this.db) {
            console.log("MusaState: Firebase DB ya inicializada. Omitiendo snapshots duplicados.");
            return;
        }

        try {
            console.log("MusaState: Inicializando Firestore y Snapshots...");
            this.db = window.firebase.getFirestore(this.app);
            
            // Sync Clients
            window.firebase.onSnapshot(window.firebase.collection(this.db, 'clients'), (snapshot) => {
                console.log("MusaState: Snapshots de Clientes recibidos:", snapshot.size);
                this.clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                this.notify();
            });

            // Sync Project List
            window.firebase.onSnapshot(window.firebase.collection(this.db, 'projects'), (snapshot) => {
                console.log("MusaState: Snapshots de Proyectos recibidos:", snapshot.size);
                this.projects = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().project?.name || 'Sin nombre',
                    total: doc.data().project?.total || 0,
                    lastModified: doc.data().project?.lastModified,
                    status: doc.data().project?.status || 'En plazo',
                    deadline: doc.data().project?.deadline || '',
                    milestone: doc.data().project?.milestone || 'Fase Inicial',
                    progress: doc.data().project?.progress || 0,
                    risk: doc.data().project?.risk || 'Bajo',
                    actualSpend: doc.data().project?.actualSpend || 0
                }));
                this.notify();
                
                // If no active project loaded, load the first one or create initial
                if (!this.data) {
                    const activeId = localStorage.getItem('musa_active_project_id');
                    if (activeId) {
                        console.log("MusaState: Cargando proyecto activo guardado:", activeId);
                        this.loadProject(activeId);
                    } else if (this.projects.length > 0) {
                        console.log("MusaState: No hay proyecto activo, cargando el primero de la lista.");
                        this.loadProject(this.projects[0].id);
                    } else {
                        console.log("MusaState: No hay proyectos en la nube, creando uno nuevo.");
                        this.createNewProject('Nuevo Presupuesto');
                    }
                }
            });
        } catch (error) {
            console.error("MusaState: Firebase Auth Init Error:", error);
        }
    }

    async loadProject(id) {
        window.firebase.onSnapshot(window.firebase.doc(this.db, 'projects', id), (doc) => {
            if (doc.exists()) {
                this.data = { id: doc.id, ...doc.data() };
                localStorage.setItem('musa_active_project_id', id);
                this.notify();
            }
        });
    }

    async saveAll() {
        if (!this.data || !this.data.id) return;
        this.data.project.lastModified = new Date().toISOString();
        const projectDoc = window.firebase.doc(this.db, 'projects', this.data.id);
        await window.firebase.setDoc(projectDoc, {
            project: this.data.project,
            chapters: this.data.chapters,
            priceCatalog: this.data.priceCatalog || []
        });
    }

    async createNewProject(name) {
        const initial = this.getInitialProjectData(name);
        delete initial.project.id; // Firestore will provide id
        const docRef = await window.firebase.addDoc(window.firebase.collection(this.db, 'projects'), {
            project: initial.project,
            chapters: initial.chapters,
            priceCatalog: initial.priceCatalog
        });
        localStorage.setItem('musa_active_project_id', docRef.id);
    }

    async deleteProject(id) {
        await window.firebase.deleteDoc(window.firebase.doc(this.db, 'projects', id));
    }

    getInitialProjectData(name) {
        return {
            project: {
                name: name || 'Nuevo Presupuesto',
                clientId: null,
                situation: '', 
                author: '',    
                authorTitle: 'MUSEOLOGO', 
                location: '',  
                taxPct: 21,    
                expensesPct: 13,
                benefitPct: 6,   
                pem: 0,        
                expensesTotal: 0,
                benefitTotal: 0,
                pec: 0,         
                taxTotal: 0,   
                total: 0,      
                date: new Date().toISOString().split('T')[0],
                lastModified: new Date().toISOString(),
                status: 'En plazo',
                deadline: '',
                milestone: 'Fase Inicial',
                progress: 0,
                risk: 'Bajo',
                actualSpend: 0
            },
            chapters: [
                { id: 'C1', order: "01", title: 'Capítulo 1', total: 0, items: [] }
            ],
            // planning field added per item dynamically
            priceCatalog: []
        };
    }

    // CLIENTS
    async addClient(clientData) {
        await window.firebase.addDoc(window.firebase.collection(this.db, 'clients'), clientData);
    }
    async updateClient(clientId, clientData) {
        await window.firebase.setDoc(window.firebase.doc(this.db, 'clients', clientId), clientData);
    }
    async deleteClient(clientId) {
        await window.firebase.deleteDoc(window.firebase.doc(this.db, 'clients', clientId));
    }

    // UPDATES (Optimistic UI + SaveAll)
    updateProjectMetadata(field, value) {
        this.data.project[field] = (field.includes('Pct') ? parseFloat(value) : value);
        this.calculate();
    }

    addChapter(title = 'Nuevo Capítulo') {
        const orderNum = this.data.chapters.length + 1;
        const order = orderNum.toString().padStart(2, '0');
        this.data.chapters.push({ id: 'C' + Date.now(), order: order, title: title, total: 0, items: [] });
        this.calculate();
    }

    renameChapter(chapterId, newTitle) {
        const chapter = this.data.chapters.find(c => c.id === chapterId);
        if (chapter) { chapter.title = newTitle; this.calculate(); }
    }

    deleteChapter(chapterId) {
        this.data.chapters = this.data.chapters.filter(c => c.id !== chapterId);
        this.calculate();
    }

    addItem(chapterId, itemData = {}) {
        const chapter = this.data.chapters.find(c => c.id === chapterId);
        if (chapter) {
            const itemOrder = `${chapter.order}.${(chapter.items.length + 1).toString().padStart(2, '0')}`;
            chapter.items.push({
                id: 'P' + Date.now(), order: itemOrder, descShort: 'Nueva Partida', descLong: 'Añadir descripción detallada de la partida...', unit: 'ud', price: 0, qty: 0, total: 0, actualSpend: 0, measurements: [],
                planning: { startDate: '', endDate: '', duration: 1, dependencies: [] },
                ...itemData
            });
            this.calculate();
        }
    }

    updateItemData(itemId, field, value) {
        this.data.chapters.forEach(c => {
            const item = c.items.find(i => i.id === itemId);
            if (item) item[field] = (field === 'price' ? parseFloat(value) : value);
        });
        this.calculate();
    }

    updateMeasurement(itemId, measurementId, field, value) {
        this.data.chapters.forEach(c => {
            const item = c.items.find(i => i.id === itemId);
            if (item) {
                const measure = item.measurements.find(m => m.id === measurementId);
                if (measure) {
                    measure[field] = ['units', 'length', 'width', 'height'].includes(field) ? (parseFloat(value) || 0) : value;
                }
            }
        });
        this.calculate();
    }

    reindexOrder() {
        if (!this.data || !this.data.chapters) return;
        this.data.chapters.forEach((c, i) => {
            c.order = (i + 1).toString().padStart(2, '0');
            c.items.forEach((item, j) => {
                item.order = `${c.order}.${(j + 1).toString().padStart(2, '0')}`;
            });
        });
    }

    moveChapter(chapterId, direction) {
        const idx = this.data.chapters.findIndex(c => c.id === chapterId);
        if (idx < 0) return;
        const newIdx = idx + direction;
        if (newIdx >= 0 && newIdx < this.data.chapters.length) {
            const temp = this.data.chapters[idx];
            this.data.chapters[idx] = this.data.chapters[newIdx];
            this.data.chapters[newIdx] = temp;
            this.calculate();
        }
    }

    moveItem(itemId, direction) {
        for (let chapterIndex = 0; chapterIndex < this.data.chapters.length; chapterIndex++) {
            let c = this.data.chapters[chapterIndex];
            const idx = c.items.findIndex(i => i.id === itemId);
            if (idx >= 0) {
                const newIdx = idx + direction;
                
                if (newIdx >= 0 && newIdx < c.items.length) {
                    // Move within the same chapter
                    const temp = c.items[idx];
                    c.items[idx] = c.items[newIdx];
                    c.items[newIdx] = temp;
                } else if (newIdx < 0 && chapterIndex > 0) {
                    // Move UP to the previous chapter
                    const itemToMove = c.items.splice(idx, 1)[0];
                    const prevChapter = this.data.chapters[chapterIndex - 1];
                    prevChapter.items.push(itemToMove);
                } else if (newIdx >= c.items.length && chapterIndex < this.data.chapters.length - 1) {
                    // Move DOWN to the next chapter
                    const itemToMove = c.items.splice(idx, 1)[0];
                    const nextChapter = this.data.chapters[chapterIndex + 1];
                    nextChapter.items.unshift(itemToMove);
                }
                
                this.calculate();
                return;
            }
        }
    }

    calculate() {
        if (!this.data || !this.data.project) return;
        this.reindexOrder();
        let pem = 0;
        let totalActualSpend = 0;
        this.data.chapters.forEach(chapter => {
            let chapterTotal = 0;
            let chapterActualSpend = 0;
            chapter.items.forEach(item => {
                let itemTotalQty = 0;
                item.measurements.forEach(m => {
                    m.subtotal = (m.units || 1) * (m.length || 1) * (m.width || 1) * (m.height || 1);
                    itemTotalQty += m.subtotal;
                });
                item.qty = itemTotalQty || 0;
                item.total = item.qty * (item.price || 0);
                chapterTotal += item.total;
                chapterActualSpend += (item.actualSpend || 0);
            });
            chapter.total = chapterTotal;
            chapter.actualSpend = chapterActualSpend;
            pem += chapterTotal;
            totalActualSpend += chapterActualSpend;
        });

        const p = this.data.project;
        p.pem = pem;
        p.expensesTotal = pem * (p.expensesPct / 100);
        p.benefitTotal = pem * (p.benefitPct / 100);
        p.pec = pem + p.expensesTotal + p.benefitTotal;
        p.taxTotal = p.pec * (p.taxPct / 100);
        p.total = p.pec + p.taxTotal;
        p.actualSpend = totalActualSpend; // Auto-calculated from items
        
        this.saveAll(); // Auto-save on every change
        this.notify();
    }

    subscribe(callback) { this.listeners.push(callback); return () => this.listeners = this.listeners.filter(l => l !== callback); }
    notify() { this.listeners.forEach(callback => callback(this.data, this.projects, this.clients)); }
}

window.state = new State();
