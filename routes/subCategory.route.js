import {Router} from "express"
import { addSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from "../controllers/subCategory.controller.js"
import auth from "../middleware/auth.js"

const subCategoryRouter = Router()

subCategoryRouter.post('/create', auth, addSubCategoryController)
subCategoryRouter.get("/get", getSubCategoryController )
subCategoryRouter.put("/update", auth, updateSubCategoryController)
subCategoryRouter.delete("/delete", auth, deleteSubCategoryController)

export default subCategoryRouter