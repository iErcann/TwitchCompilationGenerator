import { CompilationController } from "./core/classes/CompilationController";
import { compilationConfig  } from "./config"
import { ClipData } from "./core/types";
import axios from "./core/config/axios";

const compilationController  = new CompilationController(compilationConfig); 
compilationController.run();




 
