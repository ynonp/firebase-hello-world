import Feed from './feed.js';

export default class Painter {
    constructor() {
        this.mousedown = this.mousedown.bind(this);
        this.mousemove = this.mousemove.bind(this);
        this.mouseup = this.mouseup.bind(this);
        this.clear = this.clear.bind(this);
        this.save = this.save.bind(this);
    }

    init(el) {
        el.innerHTML =  `
<div id="page-painter" class="page">
  <div class="toolbar">
    <button id="btn-save">Save</button>
    <button id="btn-clear">Clear</button>
  </div>
  <div class="side-by-side">
  <div class="col">
    <canvas width="800" height="600"></canvas>         
  </div>
  <div class="col feed">
    
  </div>
  
</div>
</div>        
        `;
        this.can = document.querySelector('canvas');
        this.ctx = this.can.getContext('2d');
        $(this.can).on('mousedown', this.mousedown);
        $(this.can).on('mousemove', this.mousemove);
        $(this.can).on('mouseup', this.mouseup);
        $('#btn-clear').on('click', this.clear);
        $('#btn-save').on('click', this.save);
        const feed = new Feed(this);
        feed.init(el.querySelector('.feed'));
    }


    mousedown(e) {
        this.isPainting = true;
        this.ctx.fillRect(e.offsetX - 1, e.offsetY - 1, 2, 2);
        this.lastPosition = [e.offsetX, e.offsetY];
    }

    mouseup(e) {
        this.isPainting = false;
    }

    mousemove(e) {
        if (!this.isPainting) return;

        const from = this.lastPosition;
        const to   = [e.offsetX, e.offsetY];

        this.drawLine(from, to);
        this.lastPosition = to;

        if (this.tracking) {
            const id = this.tracking;
            firebase.firestore().collection(`/paintings/${id}/events`).add({
                from: from,
                to: to,
            });
        }
    }

    drawLine(from, to) {
        this.ctx.beginPath();
        this.ctx.moveTo(...from);
        // same as:
        // this.ctx.moveTo(from[0], from[1]);
        this.ctx.lineTo(...to);
        this.ctx.stroke();
    }

    clear() {
        this.can.width = this.can.width;
    }

    save() {
        const uid = firebase.auth().currentUser.uid;

        firebase.firestore().collection('paintings').add({
           owner: uid,
           data: this.can.toDataURL(),
            events: [],
        });
    }

    startTracking(id) {
        this.tracking = id;
        this.clear();
        firebase.
        firestore().
        collection('paintings').
            doc(id).get().then((doc) => {
           const dataUrl = doc.data().data;
           const img = new Image();
           img.src = dataUrl;
           img.addEventListener('load', () => {
              this.ctx.drawImage(img, 0, 0);
           });
        });


        firebase.
        firestore().
        collection(`/paintings/${id}/events`).
        onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data();
                    this.drawLine(data.from, data.to);
                }
            });
        });
    }
}