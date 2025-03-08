import { Injectable } from '@angular/core';
import { DbService } from '../../../shared/services/db.service';
import { ToasterService } from '@shared/services/toaster.service';
import { UploadTaskSnapshot } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  constructor(private dbService: DbService, private toaster: ToasterService) {}

  getAllMemberTypes() {
    return this.dbService.getMemberTypeCollection();
  }

}
