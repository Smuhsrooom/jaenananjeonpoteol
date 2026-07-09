import { Router } from "express";
import healthRouter from "./health";

/**
 * 로컬 mock API는 제거했습니다.
 * 지진 데이터는 프론트(Vite) → 기상청 공공데이터포털 EqkInfoService 로 직접 연동합니다.
 */
const router = Router();

router.use(healthRouter);

export default router;
