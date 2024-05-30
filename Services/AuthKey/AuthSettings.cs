namespace Services.AuthKey
{
    public static class AuthSettings //for demonstration purposes, ideally store key in a key vault somewhere //we can use the appsettings instead to store the keys
    {
        public static string PrivateKey { get; set; } = "MIICWwIBAAKBgHZO8IQouqjDyY47ZDGdw9jPDVHadgfT1kP3igz5xamdVaYPHaN24UZMeSXjW9sWZzwFVbhOAGrjR0MM6APrlvv5mpy67S/K4q4D7Dvf6QySKFzwMZ99Qk10fK8tLoUlHG3qfk9+85LhL/Rnmd9FD7nz8+cYXFmz5LIaLEQATdyNAgMBAAECgYA9ng2Md34IKbiPGIWthcKb5/LC/+nbV8xPp9xBt9Dn7ybNjy/blC3uJCQwxIJxz/BChXDIxe9XvDnARTeN2yTOKrV6mUfI+VmON5gTD5hMGtWmxEsmTfu3JL0LjDe8Rfdu46w5qjX5jyDwU0ygJPqXJPRmHOQW0WN8oLIaDBxIQQJBAN66qMS2GtcgTqECjnZuuP+qrTKL4JzG+yLLNoyWJbMlF0/HatsmrFq/CkYwA806OTmCkUSm9x6mpX1wHKi4jbECQQCH+yVb67gdghmoNhc5vLgnm/efNnhUh7u07OCL3tE9EBbxZFRs17HftfEcfmtOtoyTBpf9jrOvaGjYxmxXWSedAkByZrHVCCxVHxUEAoomLsz7FTGM6ufd3x6TSomkQGLw1zZYFfe+xOh2W/XtAzCQsz09WuE+v/viVHpgKbuutcyhAkB8o8hXnBVz/rdTxti9FG1b6QstBXmASbXVHbaonkD+DoxpEMSNy5t/6b4qlvn2+T6a2VVhlXbAFhzcbewKmG7FAkEAs8z4Y1uI0Bf6ge4foXZ/2B9/pJpODnp2cbQjHomnXM861B/C+jPW3TJJN2cfbAxhCQT2NhzewaqoYzy7dpYsIQ==";
        public static string RefreshKey { get; set; } = "dRUS1SK0A@2=6H@f7u)S:iY[7Fj=)f1;x,RK]H{bU*-i8,U54wW(+z%MiZ*AxAhdUCgBFBzmu;B;#5FD*-E7!M=f8jWRa.%dFCzz.d!DGd[ythbg6}0v{{ZuDV,GR@}j$!g7xBX.Pyvb?R]GRaDz7fMJhz6v1pgRk:vgz$#cx=Bin:30u!mP4.(kb=:NNu1yU]4/qQcx3PdS+T=[4*Cy4UwZWWHQVK]}(.&xaZU15.*b6+np.R#+=@fx=78GAa#4qH&%Njg5_xNtC4{RBu17{nc)c@$CzmYTSn_0bH3FWD";
    }
}
