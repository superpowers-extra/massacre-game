namespace Mouse {
  export const ray = new Sup.Math.Ray();
  export let hoveredButton: ButtonBehavior;
  
  export function update(camera: Sup.Camera) {
    ray.setFromCamera(camera, Sup.Input.getMousePosition());
  }
}