export default class Feed {
    constructor(painter) {
        this.hasNewData = this.hasNewData.bind(this);
        this.onClick = this.onClick.bind(this);
        this.painter = painter;
    }

    init(el) {
        el.innerHTML = `
<div class='feed'>
    <ul class="thumbnails">        
    </ul>
</div>
`;
        this.ul = el.querySelector('.feed ul');
        firebase.
        firestore().
        collection('paintings').
        onSnapshot(this.hasNewData);
        $(this.ul).on('click', 'li', this.onClick);
    }

    addNewImage(id, dataUrl) {
        $(this.ul).prepend(`
        <li data-id="${id}"><img src="${dataUrl}" /></li>
        `);
    }

    hasNewData(snapshot) {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const item = change.doc.data();
                const id = change.doc.id;
                this.addNewImage(id, item.data);
            }
        });
    }

    onClick(e) {
        const li = e.currentTarget;
        this.painter.startTracking(li.dataset.id);
        $('.feed li').removeClass('active');
        $(li).addClass('active');
    }

}