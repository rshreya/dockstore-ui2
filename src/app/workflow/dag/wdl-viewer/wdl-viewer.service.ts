/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Injectable } from '@angular/core';

import * as JSZip from 'jszip';
import * as pipeline from 'pipeline-builder';
import { Observable, from, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators';
import { GA4GHFilesQuery } from '../../../shared/ga4gh-files/ga4gh-files.query';
import { ExtendedWorkflow } from '../../../shared/models/ExtendedWorkflow';
import { ToolDescriptor, ToolFile, WorkflowsService } from '../../../shared/swagger';


/**
 * Service for creating WDL workflow visualizations with EPAM Pipeline Builder library
 */
@Injectable()
export class WdlViewerService {
  private zip: JSZip = new JSZip();
  constructor(private gA4GHFilesQuery: GA4GHFilesQuery, protected workflowsService: WorkflowsService) {
  }

  getFiles(descriptorType: ToolDescriptor.TypeEnum): Observable<Array<ToolFile>> {
    return this.gA4GHFilesQuery.getToolFiles(descriptorType, [ToolFile.FileTypeEnum.PRIMARYDESCRIPTOR,
      ToolFile.FileTypeEnum.SECONDARYDESCRIPTOR]);
  }

  /**
   * Driver function for visualizations
   * @param files
   * @param workflow
   * @param version
   */
  create(files: Array<ToolFile>, workflow: ExtendedWorkflow, version: any): Observable<any> {
    if (files.length > 1) {
      return this.createMultiple(workflow, version);
    } else {
      return this.createSingle(workflow, version);
    }
  }

  /**
   * Creates WDL workflow visualization for single-file workflows
   *
   * @param workflow
   * @param version
   */
  createSingle(workflow: ExtendedWorkflow, version: any): Observable<any> {
    return this.workflowsService.wdl(workflow.id, version.name).pipe(switchMap(prim => {
      return from(pipeline.parse(prim.content));
    }));
  }

  /**
   * Creates WDL workflow visualization for multi-file workflows (with import files)
   *
   * @param workflow
   * @param version
   */
  createMultiple(workflow: ExtendedWorkflow, version: any): Observable<any> {
    return forkJoin(this.workflowsService.wdl(workflow.id, version.name), this.workflowsService.secondaryWdl(workflow.id, version.name))
      .pipe(
        switchMap(res => {
          console.log(res);
          // Store each secondary file in a zip object
          res[1].forEach(file => this.zip.file(file.path, file.content));

          return from(this.zip.generateAsync({type: 'blob'})).pipe(switchMap(zip => {
            return from(pipeline.parse(res[0].content, {zipFile: zip}));
          }));
        })
      );
  }

  reset(visualizer: any) {
    visualizer.zoom.fitToPage();
  }

  download(visualizer: any) {
    const blob = new Blob([visualizer.paper.getSVG()], {type: 'text/plain;charset=utf-8'});
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
}
