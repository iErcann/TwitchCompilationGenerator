import { CompilationController } from "./core/classes/CompilationController";
import { compilationConfig, manualCompilationConfig } from "./config"
import { ClipData } from "./core/types";
import axios from "./core/config/axios";

const compilationController  = new CompilationController(manualCompilationConfig); 
compilationController.run();




 
