import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';@Component({  selector: 'app-course-questions',  templateUrl: './course-questions.component.html',  styleUrls: ['./course-questions.component.scss']})export class CourseQuestionsComponent extends AppComponentBase implements OnInit {  mockTests: any[] = [];  id: any;  studentId: any;  sectionData: any;  studentCourse: StudentCoursesDto = new StudentCoursesDto();  NewEnrolledMockTest: any = [];  enrollMock: any = new EnrollMockTestDto();  @Input() mockTestProps: any[];  RemovedMockTest: any;  constructor(public router: Router, injector: Injector,    private _mockTestService: MockTestServiceProxy, private _mockTestUserAnsService: MockTestUserAnsServiceProxy, private _sessionService: SessionServiceProxy, private _enrollMock: EnrollMockTestServiceProxy, private _courseService: CourseManagementAppServicesServiceProxy, private _modalService: BsModalService, private route: ActivatedRoute) {      super(injector)  }  ngAfterViewInit(): void {    this.mockTests = this.mockTestProps;  }  ngOnInit(): void {    this.route.params.subscribe(params => {      let id = params['id'];      this.id = params['id']      this.getStudent();    });    // this.getCourseDetail(this.id)  }  back() {    this.router.navigate(['app/student/my-course/list/all-course'])  }  // getCourseDetail(id){  //   // this.loading = true;  //    this._courseService.getStudentCourse(id).subscribe(res=>{  //      this.mockTests = res.mockTests;  //     // this.loading = false;  //    })  //  }  getStudent() {    this._sessionService.getCurrentLoginInformations().subscribe(res => {      this.studentId = res.user.id;      this.getCourseDetail()    })  }  getEnrollMockTest() {    this._enrollMock.getEnrolledMockTestByUserIdAndCourseId(this.studentId, this.id).subscribe(res => {      this.mockTests = res;      this.NewEnrolledMockTest = this.studentCourse.mockTests.filter(item => !this.mockTests.some(_item => _item.mockTestId === item.id));      if(this.NewEnrolledMockTest.length>0){        this.mockTests =[...this.mockTests,this.NewEnrolledMockTest]      }           this.RemovedMockTest = this.mockTests.filter(item=> !this.studentCourse.mockTests.some(_item=> _item.id== item.mockTestId))      if(this.RemovedMockTest.length>0){      this.RemovedMockTest.forEach((element => this._enrollMock.deleteEnrollMockTest(element.id).subscribe())       );          this.getCourseDetail();      }    if (this.NewEnrolledMockTest.length > 0) {          this.NewEnrolledMockTest.forEach((element) => {            this.enrollMock.mockTestId = element.id;            this.enrollMock.studentId = this.studentId;            this.enrollMock.courseManagementId = this.id;            this._enrollMock.createCourseMockTest(this.enrollMock).subscribe();           });        }    })  }   getCourseDetail() {    this._courseService.getStudentCourse(this.id).subscribe(res => {      this.studentCourse = res;      this.getEnrollMockTest();    })  }  //   getEnrolledMockTestsData(id) {  //   debugger  //     this._enrollMock.getEnrolledMockTestByUserIdAndCourseId(this.studentId, id).subscribe(res => {  //     this.enrolledMockTests = res;  //     console.log(this.enrolledMockTests);  //     this.NewEnrolledMockTest = this.studentCourse.mockTests.filter(item => !this.enrolledMockTests.some(_item => _item.mockTestId === item.id));  //   if (this.NewEnrolledMockTest.length > 0) {  //         this.NewEnrolledMockTest.forEach((element) => {  //           this.enrollMock.mockTestId = element.id;  //           this.enrollMock.studentId = this.studentId;  //           this.enrollMock.courseManagementId = this.courseId;  //           this._enrollMock.createCourseMockTest(this.enrollMock).subscribe();  //          });  //       }         // });  showInstruction(id: number,item?){       this.router.navigate(['app/student/general-instructions/'+id])     }  start(id: number,item?){     this._mockTestService.getMockTestSection(id).subscribe(res=>{      this.sectionData=res;         if(item.isView)    {      abp.message.confirm(        this.l("If you select Yes It will resume the test otherwise If you select Cancel it will  start again"),        this.l("Do you want to Resume the  mocktest...!!"),        (result: boolean) => {          if (result) {            localStorage.removeItem('tab')            this.router.navigate(['app/student/mock-test/'+ id])          }          else{            this.reattempt(id)          }        }      );    }    else{      this._mockTestUserAnsService.createUserMockTestAllSection(this.sectionData).subscribe();      this._enrollMock.markIsView(item.id).subscribe(res=>{        this.router.navigate(['app/student/mock-test/'+ id])      })    }  })  }// back() {//   this.router.navigate(['app/student/mock/upcoming/'])// }reattempt(id:number){    localStorage.removeItem('tab')    this.router.navigate(['app/student/mock-test/'+ id+'/true'])  }  showReattemptMessage(id: any) {    abp.message.confirm(      this.l("Do you want to reattempt this mocktest...!!"),      undefined,      (result: boolean) => {        if (result) {          this.router.navigate(['app/student/general-instructions/'+id])        }      }    );  }   // start(id: number) {  //   localStorage.removeItem('tab')  //   this.router.navigate(['app/student/mock-test/' + id])  // }  viewResult(id: number): void {    let createOrEditTenantDialog: BsModalRef;    if (id) {      createOrEditTenantDialog = this._modalService.show(        ViewResultComponent,        {          class: 'modal-lg modal-dialog-centered',          initialState: {            id: id,          }        }      );    }  }}