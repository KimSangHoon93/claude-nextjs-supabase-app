import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoToAppButton } from "@/components/auth/go-to-app-button";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                회원가입을 완료했습니다!
              </CardTitle>
              <CardDescription>
                이메일을 확인하여 가입을 완료해 주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                가입하신 이메일로 인증 메일이 발송되었습니다. 메일의 링크를
                클릭하여 이메일 인증을 완료한 후 아래 버튼을 눌러 주세요.
              </p>
            </CardContent>
            <CardFooter>
              <GoToAppButton />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
