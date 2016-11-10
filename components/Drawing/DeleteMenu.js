
/**
 * A menu that lets a user delete a selected vertex of a path.
 */

class DeleteMenu extends google.maps.OverlayView {
  constructor() {
    super();

    this.div = document.createElement('div');
    this.div.className = 'delete-menu';
    this.div.innerHTML = 'Delete';

    google.maps.event.addDomListener(this.div, 'click', () => {
      this.removeVertex();
    });
  }

  onAdd() {
    const map = this.getMap();

    this.getPanes().floatPane.appendChild(this.div);

    // Mousedown anywhere on the map except on the menu div will close the menu.
    this.divListener = google.maps.event.addDomListener(map.getDiv(), 'mousedown', event => {
      if (event.target === this.div) {
        return;
      }

      this.close();
    }, true);
  }

  onRemove() {
    google.maps.event.removeListener(this.divListener);

    this.div.parentNode.removeChild(this.div);

    // Clean up.
    this.set('position');
    this.set('path');
    this.set('vertex');
  }

  close() {
    this.setMap(null);
  }

  draw() {
    const position = this.get('position');
    const projection = this.getProjection();

    if (!position || !projection) {
      return;
    }

    const point = projection.fromLatLngToDivPixel(position);

    this.div.style.top = `${point.y}px`;
    this.div.style.left = `${point.x}px`;
  }

  /**
   * Opens the menu at a vertex of a given path.
   */

  open(map, path, vertex) {
    this.set('position', path.getAt(vertex));
    this.set('path', path);
    this.set('vertex', vertex);
    this.setMap(map);
    this.draw();
  }

  /**
   * Deletes the vertex from the path.
   */

  removeVertex() {
    const path = this.get('path');
    const vertex = this.get('vertex');

    if (!path || vertex === undefined) {
      this.close();

      return;
    }

    path.removeAt(vertex);
    this.close();
  }
}

export default DeleteMenu;
