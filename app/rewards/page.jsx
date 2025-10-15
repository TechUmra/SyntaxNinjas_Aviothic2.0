"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RewardPage() {
  const [user, setUser] = useState(null);
  const [totalDonations, setTotalDonations] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState([]);

  const giftCards = [
    {
      id: 1,
      name: "Amazon ₹100 Gift Card",
      pointsRequired: 100,
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
    {
      id: 2,
      name: "Swiggy ₹200 Coupon",
      pointsRequired: 200,
      image: "data:image/png;base64,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",
    },
    {
      id: 3,
      name: "Flipkart ₹300 Voucher",
      pointsRequired: 300,
      image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAtgMBEQACEQEDEQH/xAAbAAEAAQUBAAAAAAAAAAAAAAAABwEDBAUGAv/EAEUQAAEDAgIFBgsECAcBAAAAAAEAAgMEEQUxBhIhQVETYXGBkdEHFBUiMlRzk6GywRYjNLEkMzVCRGKi4UNSU3KS0vAl/8QAHAEBAAIDAQEBAAAAAAAAAAAAAAUGAgMEAQcI/8QARREAAgEDAQQFBgoHCAMAAAAAAAECAwQRBRIhMUETUXGRsQYiMlJTkhQVMzRhcoGh0eEWFyM1QlTBByRiorLi8PElRIL/2gAMAwEAAhEDEQA/AJxQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAUuEBo8Z0pwnCC5lRUh8zf8GLzndB4da66FlWr74rd1s0VbmnS4vecjXeEiqeSKCgiibudM4uPYLAdpUrS0SCWaku7ccM9Rb9FGnm02x+Un9Laz2cYC7I6XaxXDJod5WfMst0u0gaf2pKelre5ZfFtr6nj+Jiruv63gZdNp5jsJ+8kgnHCSPPrFlqnpNtLhldhnG+rR4m+w3wjwvLWYnQui4yQu1x2GxHxXDV0WS30pZ7dx0w1FfxruOywvFKHFIuVoKmOZozDTtb0jMKIq0alGWzUWGd8KkKizFmbcLWZlUAQBAEAQBAEAQBAEAQBACgMTEa+mw+kfU1krYomDa535Abys6dKdWShBZbMZzjCO0yMNI9Nq3E3OgodakpMvNNpHjnIy6ArJaaXTpYlU3v7iIr3k6m6O5HKABuQHYpU4UsBD0IAgCAqgLlNPNSTtnpZXwzM9F7DYrCcIzjsyWUexbi8x3MkLRfTwTvZSY0GxvJsypbsa48HDd05KAvNKcMzo711Epb32fNqd53gcCNihSRPSAIAgCAIAgCAIAgCAIDFxGtgw+jlqqp4ZFENZx/9vWdOnKrNQgt7MJzUFlkNaSY7UY9W8tMNSBt+RhvsYOPSeKttnZwtoYXHmQVeu6zzyNTwG8mwHE8F1t4WTSZfkzEDlQVXuXdy4PjbT/bx95G/4NX9R9zHkzEPUKr3Lu5efG+n+3j7yHwav6j7mPJmIeoVXuXdyfG+n+3j7yHwav6j7mPJmIeoVXuXdyfG+n+3j7yHwav6j7mPJmIeoVXuXdyfG+n+3j7yHwav6j7mPJmIeoVXuXdyfG+n+2j7yHwav6j7i3NRVcEZknpZ42DNz4yAOsrbR1C0ry2KVWMn1JpswnRqwWZReCxsI4grsaNafM7bQXSt1JJHheJSXpnnVhlcf1R3NPN+ShNS09TzWprfzXWSFpdbL6OXAk4FV0liq9AQBAEAQBAEAQBADkgIn8IOPHEcRNBA79FpXWJH78m89Ay7VZtKtOjp9LLi/Ahr2vtz2FwRyfSbcVLHEdNoZQVT5ZahjXRxOGqJSPS27QFQPLe7oSpU7fa87OWl1fST2iQ2XKc47uXadSXhfK8FowYhqKgV2rqN8W1c9910qnS6LOfOMcPJe8YA4LRsM2bBTxlvEL3YY6Mr4wLGwBO5FDfvPNgtUM9Q+Nxq2Na/W80DeFtrwpJ/szCKfMymh812wv1H22G11rpRW1vE2kvO4Ee41ST0mIytqIjHruLm7NjhxC+8aHeUbmxpunPawkn1plGv6bp3Et2E3u7DBO0bQpc5CVvB7jxxPDzRVL71NKALk7Xs3HpGR6uKq2p2nQVNuPosmbKv0kNl8Udeow7QgCAIAgCAIAgCA0uluKeSMBqqph+9LeTiH87tg7M+pdNlR6evGHeaLmr0VNy5kK3J2k7Tnzq5pY4EAXKUa1XA0gFplYCDvGsLrnupONCpJcVGT+5mUFmce1Euhw9EMaGjIWyXwXps73FF12cbjwYoSdsLCTzJ0kfURntSX8TK+KQmLlDBHql2rvXQ4SjQVbZjhvB4qs9rZ2mWjSUpzp4/itCrL1V3GfS1PWZTxKl9Wj+K96f/AAruHTVPWZXxSmb/AA8fxXjrr1V3Dpaj/iZdkpIYXNaYIyS0Heui5pu3koyjHesmuNWUl6TDWRM2shaCubpF6iPW5PizU6X6r9H6nWYw6uqWm2XnBWDyWrtatSjFYznOOe58SP1KP91kRqvsRVjY6PYo7BsXpq292Mdqyjiw59/Uua8oKvRlDny7TbRqulNTJyYbgWN9maphYdx6QBAEAQBAEAQBAR14Vaw61BRDLzpXfkPqp3RKfpVH2EZqM+ESP1PkYXqP8ZT+2Z8wXNefNqv1ZeDM6fyke1EtDMr8/wAeBd2VXpiXontdGaeQ6usbsJyupayca9GVpN45rtNNTzZbRbexzDqvFnDO6jqtKdGWxUWGjapJ70eVrMi5DHylybBjdrnHIBdllZyuZ/4VxfI1zmooTzCeQvaDqWs3oTULhV7iUo8FhLsQpxcY4ZbXFlGZp9LCDo/WD+VvzBT/AJK/vij2vwZx6l81kRsvtJUxuThvBNOhdZ49o3RSk3c2Pk3Hnbs+ip1/S6O5lFf8yT1rNzpRbN4uQ6AgCAIAgCAIAgIj8JMhfpQ9pOyOCNtu0/VWnSI4ts9bZCXzzX+xHLKTOQu0n4yn9sz5gua9+a1fqy8GZ0/lI9qJZGa/P0eBeGe1mYFHta9pa4bDsIXqfMFG1dVTtDJIxVRDK/pDvUpS1Ops7E0pL6fxNTpLOUBisZPmYa/W52myyV3RW+NCPe3/AEPNhvmYONYy2kpxLibxDDf7umiF3SFb7eN7q81b0dyXuo0161K1jtz/AOzkazTavlcfFYYYGX2aw13duXYFbbTyLtYR/bzcnzxuX4+BB1dcrN4pxSRj02l+KRzsdPJHJEHec0xgbN66rjyS0+dKSppqWN298TXT1i5U1tNYOr0pcHaP1RbkWtP9QVJ8mIuGtUovim/uTLBqDTtJNdRHK+0FTB2oCUfBZLymCVLP9OpcB1gH6lVnWY4rp9aJfT5ZptfSdook7wgCAIAgCAIAgIf8IbbaWVP80cbv6bfRWvSXm1XayDvV+3fYjmlInKXqT8XT+2Z8wXNe/Nav1ZeDM6fyke1ErszX59hwLw+JcWwxKoeFEPTzLKyGN8shAYxus48AFlTpyqTUIrezGTUU2RPi2Iy4pXyVcxIDjZjDkxm4L7Xpen09Pto0Yceb62Ue7uZXFVzfDkXMFwioxer5CAhoaLvldk0fXoWGrarR0ygqtTe3wXX+S5i0tJ3VTYh9p1TNBqNtuVrKl1s9UNaD8DbtVJn5b3W/ZpRXe/wJyOhUl6U2+4z9J2CPR2pY30WsYB0BwCi/Jmcqmt0py4tyf3Mkb+KjZyiuRHa+zlTKoekl+CdmrhVe7jVW7GNVc1p/to9n9WSmm+hLt/odyoYkQgCAIAgCAIAgIu8KVNyeMUtTb9bBqX52k/8AZWPRZ5pSh1PxIfUI4qKRxamThLtJ+Mp/bM+YLmvPmtX6svBmdP5SPavEldua/PkeBeHxLoWeTEI5xXFgr1LLDGUaPTOoNPo9VW9KXVjHWRf4XU/5M2/TanTyt0cvu4EdqlXYtZfTu7yNF9fyUxkg6AwCPB5JtXzpZSb8w2d6+X+WVd1L+NPlGK73vLVosVGg5PmzpHbM1UGTSNJpV+wqvob8wU95K/vmh9vgzk1H5rMjpfaiojJOAJa8G1PyGjTHnOaV8nVew/JVTVZ7Vy11biasY7NFPrOrUcdgQBAEAQBAEAQHI+EmgNVgBqWC76R+uf8AYdjuzPqUlpNbo7jZ5S3HFfw2qW11EUK1EMXaT8ZT+2Z8wXNe/Nav1ZeDM6Xyke1EqNdt2L88we5F8aKvc21nu1R02XRBVE8xjn7Mmt7PNmjxWgw2VpbI58t93j2qB2uVl0y/1CDSjHHbTb8ERdzb28uL/wA35kfVlNBDVzRtjjs15taztm7aM19QtanS0ITfNLk19z4FSqpwm45LTYowbtYwEbwBddGDXlvme16ecTw6KJxLnNYectC8xlnu1gk/Rlj4cBo45SdYR327gSSB1AgL4r5Q1Kc9UrSpLdnwWG+8vOmwlG0gpccFvSk//Cq+hvzBb/JR/wDmaHa/9LPdSX90mR6vtpTysbHyvbHELveQ1o5zkvJSUFtPkepOTSRO+E0bcPw6mpGZQxhqo9SbqTc3zLHCOzFRXIzFgZBAEAQBAEAQBAW54WTwyRSjWY9pa4HeCvU3F5XI8aysMg3HcMkwfFZ6KQXDHXjdxacirna11XpKa+0r9ak6U3FmLSfi6f2zPmC8vfmtX6svBmNL5WHavEk46rtjgCOBC/O8ZNcD6Bs5LbqSkd6VLA7pjBXTG8uI+jUkvtZqdvSfGK7jyaChOdFTe5b3LctUvlwrS95/iYfA6HqLuR4OG4ef4Kn92FsWs6j7efvMxdjbezXccXpe2CLFWw08UcbWRC4Y21ySfovpfkhVuK9g61ebk3Lnv4FU1uNOncKFNYwjTxM5WaOIX89wb2lWatUVOnKfUm+4iacNucY9bSJMZhtAzV/Q6e7bWPJgr4fU1m/qZzWlh/Sy/wALG3ikthZ7DLLtmxRjlk7FE1OkxvgdUOZvzBWDyT/fVD/6/wBLODVFizn/AM5nAL7gUs7Dwc4Ka3EjXzN+5pvR53f2UNq9yow6FcXxJCwo5l0j5Eq2VcJYIAgCAIAgCAIAgByQHLacaPDGKLl6cDxqAEsP+YcF3WF47apv9F8TluaHTR3cSJiHwzbQWSRu9E5ggq1yUatNp74yX3PcQmXGSfNHTR6XAMHK0Ti/eWyCx+C+c1f7PvPfR3GI8sx3+JYoa/iPnU9/ae/tfH6lJ7wdy1/q+qfzC93/AHHv6QR9m+8fa+P1KT3g7k/V9V/mF7v+4fH8fZvvH2vj9Sk4/rB3Iv7Pqq/9he7+Yevx9m+85vE6jx6vmqSCwPIs0/ugAC3wV40nTFp9nC32suPP7clfvanwmvKr1nmglbTVkNQ9he2N4dqg21luv7N3NrUowlhyWM8cZ+gxt9mlVjUa4PJ032ui9Sk94O5UH9X1X+YXu/mWL9II+zfePtfH6lJ7wdyfq+q/zC938x+kEfZvvMDF9InV9KaaKnMbXkaxc65NtymdD8kI6bdK5qVNtx4YWOO7rZx3uru5pdHGOE+JgYRhk+L1zKWmBuSNd1vQHFWy5uYW9PbkRlGlKrLZRNGD4dDhVDFSU4s1gsecqnVasqs3OXFk/CChHZRnrAyCAIAgCAIAgCAIAgKEXFkBxemOiDcQ1qyhAZUgbRbY/mKkrDUJW/mS3x8DjubVVfOjxI0qIJaaZ0NQwskbsLXKz06kakdqDyiHlFxeJFtZmJRAEAQBAVQFN10BsMFwerxioEVIw6t7Oktsb/dctzeU7aOZceo3UaEqz80lzR3AafBKURwi8h2vecyVVLm5qXE9uZN0aUaUdmJuVoNoQBAEAQBAEAQBAEAQBAUIugNPjmjlFjEdp4wH7ngbQt9C5q0JZgzVUowqLEkR7jGg+IULnOpbVEQ6nf3U7b6xTluqrZf3EbVsJx3weTmqiCaldq1MT4ncHtspWnUhUWYPJxTi4eksFq44rMxyVQZKEgC5I7UGUZlFhddWuaKamkcDk4iw7Vz1bujR9ORthRqVPRR2OB+D6SQtlxWUBt78kzI9ah7jWG/NorH0nfRsEvlHk76ioKehgbDTRNY1o3CyhZSlJ7Ut7JGKUVhGUFiehAEAQBAEAQBAEAQBAEAQBAEBSyAsTUNNOLSwscDnszRbnlB7+JrZdFMElJL6CLbwFvyXTG8uI7lNmp0KT4xLQ0NwAG4w9n/IrN39z67MfgtH1UZVPo5hFMbw0MTTx1dvatM7irU9KTZsjShHgjYRwRRC0bGt6AtJmXALICqAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgP//Z",
    },
    {
      id: 4,
      name: "Myntra ₹500 Voucher",
      pointsRequired: 500,
      image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAzwMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABgcCAwUEAf/EADcQAAICAQIDBAcHBAMBAAAAAAABAgMEBRESITEGIkFRBxMyYXGBkRQjM0KhscFDUnLRgqLwYv/EABsBAQADAQEBAQAAAAAAAAAAAAAEBQYDAgEH/8QAKBEBAAICAgEEAwEAAgMAAAAAAAECAwQREgUTITFBBiJRYXGRFTIz/9oADAMBAAIRAxEAPwC8QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYyko9XsBjxvwTYGUZqXRgZAAAGMpKK3bAx9Zy9lgZRkmBkAAAAAAAAAAAAAAAAAAPkpKK3YHD7Sa9i6Bpss7OaculNXjOXkj7EO2vhtmv1qrda52vzbVqtWSqlLvV4qa4eHy28Spz7vTL1Xn/j8Va9ePdYPZTtHXr+G58Kpzqe7fQ+qfn8CfhzRlrzCl2de2GyRQkpLdHZHZAfG9ub6AcnXdZxNE027UM+XDCC7kfGcn0S954veKRzLpixWy36VVHn9sO1Gbn/AG6jJeNXF714yfd2968TtgxXyU7Q0+LxFfS/aFj9i+1VPaTEkpJU6hT+PT/K9x5mJieJZ/c1La1/8SmualHkfERmAAAAAAAAAAAAAAAA+MDzZFsIRnZbNQqrTlOTfJJAiJmeIUn2h1aztJrU867dYtTcMWp9OFP2vmT9XDz+0tr4vR9HHzaPeXd0t76dj/4IxPk442r/APL1m/8ApLGyV2l51esYEW7qfxa4/wBaHiviNPZnHeIlC2cEZqTH2svTc/HzsKjNxZ8dF8VKLNNWe0cwzF6TS3WXv35H14aLpx73FLhhBbyk+iH1yRHPsp7tLrD7Sau7029PxpOONDwm/Gf+vcUe9s9p61azxmlGKna3y5VvK2Rq/Fzzq1mF/T4YY2TkaVqNOq4D2vofeiv6kPGLOmzg7RzCFv6kZ8cwu3R9To1XT8fUMRp1XxT/AMX5MrPhhcuK2K80t9Omnug5voAAAAAAAAAAAAAAGu2XCtvF9AK89JusuFVWg4strLV6zKcX0h4L5v8AQ74Mfey68Ppzlyd7R7QgkUlFJLbYt6x14iGy44iOEm0aSlp9a8t1+pgfNUmm1b/VXsRxkl7duZU/Ti9/Y7Njp2oz0uyW2LmNzx/KFnjH5rmX/jdnt+kypvJa/t6kJyptR2l7S5FupkM9IurSowY6PjzavzE3dKL5wq8fr0+pC3c8Y8fH2tPFas5svafiEDjGMIKEElGK2SRnZmZnmWu44ee5feM2/hb9taEinww+JbvaT+jnWFpmrT0rIltiZ0t6d+kLfFfP90Vezi625hmfN6U8erWFq0truy6oiMw2gAAAAAAAAAAAAA+MDxZ2XVh41+ZkSUaqIOTbEe71jpOS0Vj7UhlZduo5+TqGRv63JnxtP8q6JfQuNfH0q3+lrxgwxVr8/ed0x3Oz9m9Ntf8AbLdGO/IsXGWLq/brxbl1zNojTkVOyvuT4LINTrn/AGyXNM64sk0vEvF6xaJrP2nWn6lVmaTXqeRJVKutu+LfsSj7X7Gqx5q3x92WyYbUy+nCrNQzrNU1DI1C3dO6W8U/yRXsr/3mZ/az+rk5bLR14wYYj7aCMltGQue5q/x7L+lsbtjlpNI6MZqWylXLhsg1KEvJrmmeMlIvXhyzY4y0ms/a5ey+rrWdFxc9crduC+H9s1yZS3rNZ4lgNvXnBlmku7F7rc8oz6AAAAAAAAAAAAGFsuGDYEA9J2p+rxcXSKpd7Ibtv2f5F0T+Lf6EnWx9rLzwmr6mX1J+IQAto9mxAJL2Z0+U9Ky9QXSM4wX8/uZ38grFsfP8Uu9s8bFcT2oxkPgwPNqOoW42nX4Nb2rypJz9yXX68idh2rUxTRzrp1yZ4yfxw2R1qAeqGnTv0XOzl0xpQXyb5mh8BzGW1v6jW2ox7NcX95cg1yz/AMAJX6NtSWJrF+n2S+4zY8UV5Wx/2v2K7bx9Z7M157V/WMtVo0N7cMuqILLtoAAAAAAAAAAAAabHxWJb8lzYFLdpc96nr+blP2FZ6uv/ABjyX8lrq0605brxOv6OtH9lzSUsxvZbg5Wz2b0v1HZOnDnytvqdkk/N8/8ARQ78et2qwm5tTbdm/wDJRlrhk4tbNPYxNo62mF/WeYiXzmfH1wtQt9dkya6R5I6QmYo4q87PTqAWP2c0qMuyMsa2K48yuUmn479DTeOp6VKyyG5tTO53j6lVtlcqbJVWLvwbjL4o1FZ5jltsd4yUi8fbE+vbPHyJ4eTVlVfiUzjOPyfQ5Zqd6cI21h9bFan9XlhZEMmqnJqa4L4KSfxRSy/Pb162ms/T2LoHkAAAAAAAAAAPjA43aLNWBouoZa9qFbUfj0X7nvHXtaISNTF6uetP9Uut1Hm95Pqy7rERHD9DpXrWKw+n16dHs/gS1LWMXGS7rmpT/wAV1OWa/WnKDv5/QwWt9rffcyYTh7Fa4NvcUs+7ATbmZRPtBi/ZtUs4VtCzvx+Zl9/F6eaf5LSePy+pijn5hyrrFXTObfREKI90+vvKOtuTbfVnWFhEcPgHr0zFlnajj4tabdtiXwXi/odsFO94qj7WWMWGbythwVNtKr5QojwpLyNRWvWOGFtM3mZlWfbzTvsGvWTgtqshesj8fEuNW/ajaeF2fV1+s/MI4SVwfISLQ9HuZLJ7NRqm954lzq/49V+j/QptmnW7DeXwRi2p4+JS+D3ijiq2QAAAAAAAAABjPlFsCG+kW519m4Qj/Wvin79uf8ErUrzdceDp22uZ+oVkWrah9gWD6ONM9TjXardDvW/d07/2+L+pW7mXmYrDJed2u2SMVZ+E2jV9xs11XMgs+4/aHEeVpytjH72h8/gV3kcHqYu0fMJ/j83p5OJ+JQfU5bYctvF7GciPdp8PvZxDomvoE09H+nOLu1S2OyS4Kt/Pxf8ABb+NwfOSWc83s8zGGE2rq3pfF1Zcs+jXbfS5alobtqhvkYcuJJeMfFfT9iTq5Ol+J+1p4jZ9DYiJ+J9lW77ls3ETz7gfU79F1r4tSo57OMZ7fVFfu14mJZf8hpEWpdYVL3rRAZpsAAAAAAAAAAMbPYYEM9I1UrOz1M4Lf1VycvdvuiXpzHdc+CvFdnj+qzLRtOHQ0LSrtZ1CGJQnwvnZPblGJzzZIx15+0Le2662KbT8rhxMeuqurGohw0UxUVsUtp5tzLBZLzktNpe/blt4Hx4eW1KE3KS3hJbSQmItHEnPHvCAdrtMngKfCm6ZPig/cZjb1pw35+mq8Zs1yxEfaKkZcvXpWn36nm14uPHnJ96XhFebO2DFOW3WqNtbFdfF2stfCxasWinDxvwqUlv5s02OkY6xWGJy5LZLze3y6MUlHY6Oby3R4LG2t4SW0lsH2J4n2VT2y0OWj6i7K4v7Je3KuS6J+KLbWzRevH22vid6NjFFLf8AtCP/AB5IkrdOfRdXL12o37NQUIw3fn1K/dn4Zj8htHNKrEo/CRAZlsAAAAAAAAAAPj6Ac7Pxacmi7Eyo8VFy2fuPVbTWeYe8WS2K8Xr8whM/R3J5G9WpQWP170O9sTo3f1+Pdoq/kHGP3p7pXo2lYukYyxcCO7l7dr6yZDyZLZJ5lR7O1fZv2u7NVarikjmjNgGFkFOOzW4HPy8WnJoliZsOOma6+Rzy4q5Y4s6Y8tsVu1USs7BOV29GowVDf5o7ySKufGT29p9l5TznFfevukej6ViaTQqMGLnZL8S6S5sscGvTDHEKjZ2smxbm3/TsU1qEdjujNoGFkFOLTA5ufhUZeLPEzqlZjz/6nqt5rPMOuHNfDbvSUMv9HblfxYupQWP/APcN5JE2u7xHwv8AH+QzWn7V90s0bS8fSsGODg7yW/FZY/zMiZMk5J5lSbWzfYyd7O1CPDFJHNGZAAAAAAAAAAADCcFJc1uBq+y1778KA2whGK2SAzAAAMZQUlzA1fZa3z4UBsjXGPRAZgAAGMoKS2a3A1PFrb34UBshXGC2SXyAzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/9k=",
    },
  ];

  useEffect(() => {
    const fetchUserAndDonations = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user;

      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const { data, error } = await supabase
        .from("donations")
        .select("id")
        .eq("donor_id", currentUser.id);

      if (error) {
        console.error("Error fetching donations:", error);
        setLoading(false);
        return;
      }

      const total = data?.length || 0;
      const rewards = total * 10;

      setTotalDonations(total);
      setRewardPoints(rewards);
      setLoading(false);
    };

    fetchUserAndDonations();
  }, []);

  // ✅ Handle reward claim with point deduction
  const handleClaim = (gift) => {
    const alreadyClaimed = claimed.includes(gift.id);
    const enoughPoints = rewardPoints >= gift.pointsRequired;

    if (!enoughPoints || alreadyClaimed) return;

    alert(`🎉 You have claimed: ${gift.name}`);

    // Deduct points and mark as claimed
    setRewardPoints((prev) => prev - gift.pointsRequired);
    setClaimed((prev) => [...prev, gift.id]);
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎁 Reward Points</h1>

      {user ? (
        <div
          style={{
            backgroundColor: "#f3f4f6",
            padding: "2rem",
            borderRadius: "12px",
            textAlign: "center",
            width: "fit-content",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}
        >
          <p>
            <strong>Donor:</strong> {user.email}
          </p>
          <h2 style={{ fontSize: "1.5rem", margin: "1rem 0" }}>
            🧺 Total Donations: {totalDonations}
          </h2>
          <h2 style={{ fontSize: "1.8rem", color: "#16a34a" }}>
            ⭐ Total Reward Points: {rewardPoints}
          </h2>
        </div>
      ) : (
        <p>No user logged in.</p>
      )}

      {/* 🎁 Gift Cards Grid */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.5rem",
          justifyItems: "center",
        }}
      >
        {giftCards.map((gift) => {
          const canClaim = rewardPoints >= gift.pointsRequired;
          const isClaimed = claimed.includes(gift.id);

          return (
            <div
              key={gift.id}
              style={{
                width: "180px",
                height: "220px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                textAlign: "center",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
            >
              <img
                src={gift.image}
                alt={gift.name}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                  marginBottom: "0.5rem",
                }}
              />
              <div>
                <h3 style={{ fontSize: "1rem", margin: "0.5rem 0" }}>{gift.name}</h3>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>
                  {gift.pointsRequired} Points
                </p>
              </div>
              

              <button
                onClick={() => handleClaim(gift)}
                disabled={!canClaim || isClaimed}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: canClaim && !isClaimed ? "#16a34a" : "#9ca3af",
                  color: "white",
                  cursor: canClaim && !isClaimed ? "pointer" : "not-allowed",
                  fontWeight: "bold",
                  transition: "0.3s ease",
                }}
              >
                {isClaimed ? "Claimed" : canClaim ? "Claim" : "Locked"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
