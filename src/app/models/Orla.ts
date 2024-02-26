import { Alumno } from "./Alumno";
import { Profesor } from "./Profesor";

export class Orla {
    id: string
    profesores: Profesor[]
    alumnos: Alumno[]

    constructor(id: string, profesores: Profesor[], alumnos: Alumno[]) {
        this.id = id
        this.profesores = profesores
        this.alumnos = alumnos
    }

}