import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";

type UseVerifyEmailReturn = {
  inputRefs: React.MutableRefObject<HTMLInputElement[]>;
  timeLeft: number;
  canResend: boolean;
  token: string;
};

const useVerifyEmail = (): UseVerifyEmailReturn => {
  const params = useParams();
  const urlToken = params.token;

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [timeLeft, setTimeLeft] = useState(300); // 5-minute countdown
  const [canResend, setCanResend] = useState(false);
  const [token, setToken] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (!urlToken) {
      alert("You are not authorised to view this page");
      router.push("/");
    } else {
      setToken(Array.isArray(urlToken) ? urlToken[0] : urlToken);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, urlToken]);

  return {
    inputRefs,
    timeLeft,
    canResend,
    token,
  };
};

export default useVerifyEmail;
