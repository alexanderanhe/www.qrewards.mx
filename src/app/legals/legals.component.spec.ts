import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalsComponent } from './legals.component';

describe('LegalsComponent', () => {
  let component: LegalsComponent;
  let fixture: ComponentFixture<LegalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
