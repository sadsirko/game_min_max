const funcForStart = () => {
  spec.findZones();
  spec.workWithSpecArr();
  spec.firstFilling();
  everyStep(drawing, rule, spec, mover);
};

document.onload = funcForStart();
