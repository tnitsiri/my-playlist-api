import { All, Controller } from '@nestjs/common';

/**
 * ANCHOR App Controller
 * @date 18/04/2025 - 10:39:46
 *
 * @export
 * @class AppController
 * @typedef {AppController}
 */
@Controller()
export class AppController {
  /**
   * ANCHOR Index
   * @date 22/04/2025 - 00:59:14
   *
   * @returns {[]}
   */
  @All()
  index(): [] {
    return [];
  }
}
