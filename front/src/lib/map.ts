import L from "leaflet";
import type { LatLngExpression } from "leaflet";

interface MapMarker {
  marker: L.Marker;
  id: string;
}

interface MapInstance {
  instanceId: string;
  instance: MapManager;
}

/**
 * Manages the map and its related functionalities.
 */
export default class MapManager {
  private mapInstance: L.Map | null = null;
  private static instances: MapInstance[] = [];
  public leaflet: typeof L = L;
  public setLoading: (loading: boolean) => void = () => {};
  public initialPosition: LatLngExpression = [46.603354, 1.888334];
  private markers: MapMarker[] = [];
  private icon = L.icon({
    iconUrl:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=",
  });

  public static getInstance(instanceId: string) {
    if (
      MapManager.instances.length === 0 &&
      window !== undefined &&
      !MapManager.instances.find((i) => i.instanceId === instanceId)
    ) {
      MapManager.instances.push({
        instanceId,
        instance: new MapManager(),
      });
    }

    return MapManager.instances.find((i) => i.instanceId === instanceId)!
      .instance;
  }

  public setLoadingSetter(loadingSetter: (loading: boolean) => void) {
    this.setLoading = loadingSetter;
  }

  public initializeMap(
    mapContainerId: string,
    initialPosition: L.LatLngExpression
  ) {
    if (!this.mapInstance) {
      this.initialPosition = initialPosition;
      this.mapInstance = L.map(mapContainerId, { minZoom: 3 }).setView(
        initialPosition,
        6
      );
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.mapInstance);
    }
  }

  public getMapInstance() {
    return this.mapInstance;
  }

  public setZoomOnPosition(points: [number, number][]) {
    const bounds: [number, number][] = points;
    this.mapInstance?.fitBounds(bounds);
    if (points.length === 1) {
      this.mapInstance?.setZoom(13);
    }
  }

  public reset() {}

  public setMarker(
    position: [number, number],
    markerId: string = "marker",
    setFocus: boolean = false,
    popUpTitle: string = "",
    popUpContent: string = ""
  ) {
    if (!this.mapInstance) {
      return;
    }
    // if a marker with the same id already exists, remove it
    const existingMarker = this.markers.find((m) => m.id === markerId);
    existingMarker ? this.removeMarker(markerId) : null;

    const marker = L.marker(position, { icon: this.icon }).bindPopup(
      `<b>${popUpTitle}</b><br>${popUpContent}`
    );
    marker.addTo(this.mapInstance!);
    this.markers.push({ marker, id: markerId });

    if (setFocus) {
      this.mapInstance.setView(position, 13);
    }
  }

  public removeMarker(markerId: string) {
    const marker = this.markers.find((m) => m.id === markerId);
    if (marker) {
      marker.marker.remove();
      this.markers = this.markers.filter((m) => m.id !== markerId);
    }
  }

  public removeAllMarkers() {
    this.markers.forEach((m) => m.marker.remove());
    this.markers = [];
  }

  public invalidateSize() {
    this.mapInstance?.invalidateSize();
  }
}
