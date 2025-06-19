interface SscQualificationFormProps {
    sscQualificationData: {
        id?: number;
        subject: string;
        grade: string;
    }[];
    isEdit: boolean;
    handleChangeSscQualification: (index: number, fieldName: string, value: any) => void;
    addSscQualification: () => void;
    removeSscQualification: (index: number) => void;
}